import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"
import { readFileSync } from "fs"
import { resolve } from "path"

// Load .env.local manually if env vars are missing (Turbopack root issue)
if (!process.env.ANTHROPIC_API_KEY) {
  try {
    const envPath = resolve(process.cwd(), ".env.local")
    const envContent = readFileSync(envPath, "utf-8")
    for (const line of envContent.split("\n")) {
      const [key, ...rest] = line.split("=")
      if (key?.trim() && rest.length) {
        process.env[key.trim()] = rest.join("=").trim()
      }
    }
  } catch {}
}

// Load system prompt from file — single source of truth
const SYSTEM_PROMPT = readFileSync(resolve(process.cwd(), "system-prompt.md"), "utf-8")

// Rate limiting — per IP, in-memory (resets on cold start, but good enough for Vercel)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10 // max 10 messages per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) return true
  return false
}

// Supabase REST API — no SDK needed, avoids Turbopack compatibility issues
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url, key }
}

async function supabaseRequest(path: string, method: string, body?: unknown, query?: string) {
  const config = getSupabaseConfig()
  if (!config) return null
  const url = `${config.url}/rest/v1/${path}${query ? `?${query}` : ""}`
  const res = await fetch(url, {
    method,
    headers: {
      "apikey": config.key,
      "Authorization": `Bearer ${config.key}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=minimal" : "return=representation",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) return null
  if (method === "GET") return res.json()
  return true
}

async function saveConversation(
  sessionId: string,
  messages: Array<{ role: string; content: string }>
) {
  try {
    // Try to find existing conversation
    const existing = await supabaseRequest(
      "conversations",
      "GET",
      undefined,
      `select=id&session_id=eq.${sessionId}&limit=1`
    )

    if (existing && existing.length > 0) {
      await supabaseRequest(
        "conversations",
        "PATCH",
        { messages: JSON.stringify(messages), updated_at: new Date().toISOString() },
        `session_id=eq.${sessionId}`
      )
    } else {
      await supabaseRequest("conversations", "POST", {
        session_id: sessionId,
        messages: JSON.stringify(messages),
      })
    }
  } catch (err) {
    console.error("Failed to save conversation:", err)
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  // Limit conversation length to prevent abuse
  const body = await req.json()
  const { messages, sessionId } = body

  if (!messages || !Array.isArray(messages) || messages.length > 50) {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  const client = new Anthropic({ apiKey })

  try {
    // Save conversation to Supabase (non-blocking)
    if (sessionId) {
      saveConversation(sessionId, messages)
    }

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const encoder = new TextEncoder()
    let fullResponse = ""

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullResponse += event.delta.text
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
              )
            }
          }

          // Save the full conversation including assistant response
          if (sessionId) {
            const fullMessages = [
              ...messages,
              { role: "assistant", content: fullResponse },
            ]
            saveConversation(sessionId, fullMessages)
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (err) {
    console.error("Chat API error:", err)
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
