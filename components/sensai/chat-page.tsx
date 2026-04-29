"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

// ─── SENS design tokens (shared with one-pager) ────────────────────
const SENS = {
  bg: '#eef1f8',
  bgDeeper: '#e6ebf5',
  ink: '#0b1530',
  inkSoft: '#475069',
  blue: '#0c2c63',
  blueBright: '#1a44a8',
  rule: '#dfe4ee',
  card: '#ffffff',
  muted: '#7a849c',
} as const

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_ACTIONS = [
  "What is sensAi?",
  "How does sensAi detect bonus abuse?",
  "Is sensAi only for iGaming?",
  "Do I need to change my CRM platform?",
]

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Render markdown-like formatting: **bold**, [links](url), bullets, paragraphs
function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
        if (boldMatch) {
          return <strong key={i} style={{ fontWeight: 600 }}>{boldMatch[1]}</strong>
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (linkMatch) {
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
              style={{ color: SENS.blueBright, textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}>
              {linkMatch[1]}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function RenderMessage({ text }: { text: string }) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let currentBullets: string[] = []
  let key = 0

  function flushBullets() {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={key++} style={{ marginTop: 8, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {currentBullets.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: 1.55 }}>
              <span style={{ flexShrink: 0, marginTop: 2 }}>{b.match(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u)?.[0] || "•"}</span>
              <span><InlineFormat text={b.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, "")} /></span>
            </li>
          ))}
        </ul>
      )
      currentBullets = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const isBullet = /^[-•]\s/.test(trimmed)
      || (/^\*\s/.test(trimmed) && !trimmed.startsWith("**"))
      || /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(trimmed)
    if (isBullet) {
      currentBullets.push(trimmed.replace(/^[-*•]\s*/, ""))
    } else if (trimmed === "") {
      flushBullets()
    } else {
      flushBullets()
      elements.push(
        <p key={key++} style={{ marginTop: key > 1 ? 8 : 0, lineHeight: 1.55 }}>
          <InlineFormat text={trimmed} />
        </p>
      )
    }
  }
  flushBullets()

  return <>{elements}</>
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [sessionId, setSessionId] = useState(() => generateSessionId())

  function clearChat() {
    setMessages([])
    setInput("")
    setSessionId(generateSessionId())
    setShowQuickActions(true)
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return

    setShowQuickActions(false)
    const userMessage: Message = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setStreaming(true)

    setMessages([...newMessages, { role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  accumulated += data.text
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: accumulated,
                    }
                    return updated
                  })
                }
              } catch {
                // skip malformed
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="sensai-chat-shell" style={{
      display: 'flex', flexDirection: 'column',
      background: SENS.bg,
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
      color: SENS.ink,
    }}>
      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 24px',
        borderBottom: `1px solid ${SENS.rule}`,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
      }}>
        <Link href="/" style={{
          width: 34, height: 34, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: SENS.inkSoft, textDecoration: 'none',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = SENS.bgDeeper)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ArrowLeft size={18} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <img src="/sensai-mascot.png" alt="sensAi" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <span style={{
            fontSize: 20, fontWeight: 600, letterSpacing: '0.08em', color: SENS.ink,
          }}>
            sens<span style={{ fontSize: '1.15em', fontWeight: 700, letterSpacing: 0 }}>A</span>i
          </span>
        </div>

        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', fontSize: 12, fontWeight: 500,
            color: SENS.inkSoft, background: 'transparent',
            border: `1px solid ${SENS.rule}`, borderRadius: 8,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = SENS.bgDeeper; e.currentTarget.style.color = SENS.ink }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SENS.inkSoft }}
          >
            <RotateCcw size={13} />
            New chat
          </button>
        )}
      </header>

      {/* ── Chat area ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.length === 0 ? (
          /* ── Empty state ── */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px',
          }}>
            <img src="/sensai-mascot.png" alt="sensAi" className="sensai-fade-in"
              style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 24 }} />
            <h1 style={{ fontSize: 26, fontWeight: 600, color: SENS.ink, margin: 0 }}>
              Hi! I&apos;m sensAi
            </h1>
            <p style={{ marginTop: 8, fontSize: 15, color: SENS.inkSoft, maxWidth: 440, lineHeight: 1.55 }}>
              Your adaptive intelligence assistant. Ask me anything about how sensAi can help your iGaming operation.
            </p>

            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 520 }}>
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => { setInput(action); inputRef.current?.focus() }}
                  style={{
                    padding: '10px 18px', fontSize: 13, fontWeight: 500,
                    border: `1px solid ${SENS.rule}`, borderRadius: 999,
                    background: '#fff', color: SENS.ink,
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = SENS.blue
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = SENS.blue
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fff'
                    e.currentTarget.style.color = SENS.ink
                    e.currentTarget.style.borderColor = SENS.rule
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 24px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className="sensai-fade-in"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 16,
                }}
              >
                {msg.role === "assistant" && (
                  <img src="/sensai-mascot.png" alt="sensAi"
                    style={{ width: 32, height: 32, borderRadius: 8, marginTop: 4, flexShrink: 0 }} />
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: 14,
                  lineHeight: 1.55,
                  ...(msg.role === 'user'
                    ? { background: SENS.blue, color: '#fff', marginLeft: 40 }
                    : { background: '#fff', color: SENS.ink, border: `1px solid ${SENS.rule}` }
                  ),
                }}>
                  {msg.role === "assistant" ? (
                    msg.content === "" && streaming ? (
                      <span style={{ display: 'inline-flex', gap: 5, padding: '4px 2px' }}>
                        {[0, 1, 2].map(j => (
                          <span key={j} className="sensai-dot-pulse" style={{
                            width: 6, height: 6, borderRadius: '50%', background: SENS.muted,
                            animationDelay: `${j * 0.15}s`,
                          }} />
                        ))}
                      </span>
                    ) : (
                      <RenderMessage text={msg.content} />
                    )
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div style={{
        borderTop: `1px solid ${SENS.rule}`,
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(8px)',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 12,
            background: '#fff', border: `1px solid ${SENS.rule}`,
            borderRadius: 14, padding: '12px 16px',
            boxShadow: '0 4px 12px -6px rgba(15,28,70,0.1)',
            transition: 'border-color 0.15s',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about sensAi..."
              rows={1}
              style={{
                flex: 1, background: 'transparent', fontSize: 14,
                color: SENS.ink, resize: 'none', outline: 'none',
                border: 'none', minHeight: 24, maxHeight: 128,
                lineHeight: 1.5, fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: input.trim() && !streaming ? SENS.blue : SENS.bgDeeper,
                color: input.trim() && !streaming ? '#fff' : SENS.muted,
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !streaming ? 'pointer' : 'default',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </div>
          <p style={{ fontSize: 10, color: SENS.muted, textAlign: 'center', marginTop: 8, opacity: 0.5 }}>
            Powered by sensAi
          </p>
        </div>
      </div>
    </div>
  )
}
