"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_ACTIONS = [
  "What is Sensai?",
  "We're an iGaming operator",
  "How can Sensai help with fraud?",
  "Book a demo",
]

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useMemo(() => generateSessionId(), [])

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

  function renderMessage(text: string) {
    // Convert markdown links [text](url) to clickable links
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
    return parts.map((part, i) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            {match[1]}
          </a>
        )
      }
      return <span key={i}>{part}</span>
    })
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
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link
          href="/"
          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-2.5">
          <img src="/sensai-mascot.png" alt="Sensai" className="w-8 h-8 rounded-lg" />
          <span
            className="text-xl tracking-[0.08em] lowercase text-foreground"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600 }}
          >
            sensai
          </span>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <img src="/sensai-mascot.png" alt="Sensai" className="w-20 h-20 rounded-2xl mb-6" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Hi! I&apos;m Sensai
            </h1>
            <p className="text-base text-muted-foreground mb-8 max-w-md">
              Your adaptive intelligence assistant. Ask me anything about how Sensai can help your iGaming operation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="px-4 py-2.5 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors cursor-pointer text-foreground"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/sensai-mascot.png"
                    alt="Sensai"
                    className="w-7 h-7 rounded-lg mr-3 mt-1 shrink-0"
                  />
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? renderMessage(msg.content) : msg.content}
                  {msg.role === "assistant" && msg.content === "" && streaming && (
                    <span className="inline-flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-background border border-border rounded-2xl px-4 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Sensai..."
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-32"
              style={{ minHeight: "28px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            Powered by Sensai AI
          </p>
        </div>
      </div>
    </div>
  )
}
