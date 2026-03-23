import { SensaiOnePager } from "@/components/sensai/one-pager"
import { ChatWidget } from "@/components/sensai/chat-widget"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SensaiOnePager />
      <ChatWidget />
    </main>
  )
}
