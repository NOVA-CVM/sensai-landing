"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

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
          return <strong key={i} className="font-semibold">{boldMatch[1]}</strong>
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (linkMatch) {
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 font-medium text-primary">
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
        <ul key={key++} className="mt-2 mb-2 space-y-1.5">
          {currentBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px]">
              <span className="shrink-0 mt-0.5">{b.match(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u)?.[0] || "•"}</span>
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
    // Detect bullet lines: starts with -, single *, •, or emoji
    // But NOT ** (that's bold, not a bullet)
    const isBullet = /^[-•]\s/.test(trimmed)
      || (/^\*\s/.test(trimmed) && !trimmed.startsWith("**"))
      || /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(trimmed)
    if (isBullet) {
      currentBullets.push(trimmed.replace(/^[-*•]\s*/, ""))
    } else if (trimmed === "") {
      flushBullets()
      // Skip empty lines (spacing handled by CSS)
    } else {
      flushBullets()
      elements.push(
        <p key={key++} className={key > 1 ? "mt-2" : ""}>
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
        <Link
          href="/"
          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-2.5 flex-1">
          <img src="/sensai-mascot.png" alt="sensAi" className="w-8 h-8 rounded-lg" />
          <span
            className="text-xl tracking-[0.08em] text-foreground"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600 }}
          >
            sens<span style={{ fontSize: '1.15em', fontWeight: 700 }}>A</span>i
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        )}
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <img src="/sensai-mascot.png" alt="sensAi" className="w-20 h-20 rounded-2xl mb-6 animate-fade-in" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Hi! I&apos;m sensAi
            </h1>
            <p className="text-base text-muted-foreground mb-8 max-w-md">
              Your adaptive intelligence assistant. Ask me anything about how sensAi can help your iGaming operation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center max-w-lg">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action)
                    inputRef.current?.focus()
                  }}
                  className="px-4 py-2.5 text-sm font-medium border border-border rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer text-foreground"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-6 space-y-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 animate-fade-in ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/sensai-mascot.png"
                    alt="sensAi"
                    className="w-8 h-8 rounded-lg mt-1 shrink-0"
                  />
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md ml-10"
                      : "bg-muted/60 text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    msg.content === "" && streaming ? (
                      <span className="inline-flex gap-1.5 py-1 px-1">
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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

            {/* No follow-up suggestions — let the user type freely */}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-background border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:border-primary/30 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about sensAi..."
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-32"
              style={{ minHeight: "28px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0 cursor-pointer hover:shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
            Powered by sensAi
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
