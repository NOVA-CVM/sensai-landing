"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"

export function ChatWidget() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-medium text-sm"
    >
      <MessageSquare className="w-4 h-4" />
      Chat with Sensai
    </Link>
  )
}
