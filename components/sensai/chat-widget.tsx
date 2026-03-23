"use client"

import Link from "next/link"

export function ChatWidget() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
    >
      <img src="/sensai-mascot.png" alt="Chat with Sensai" className="w-10 h-10 rounded-full" />
    </Link>
  )
}
