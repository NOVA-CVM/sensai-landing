import type { Metadata } from 'next'
import { SensAiOnePager } from "@/components/sensai/one-pager"

// The pre-repositioning homepage. It is what www.novacvm.net serves at "/" (rewritten by
// middleware, so the URL stays novacvm.net/). Reachable directly only as /legacy, which is
// noindex so it cannot compete with getsensai.co in search.
export const metadata: Metadata = {
  title: 'sensAi - Adaptive Intelligence for iGaming',
  description: 'sensAi is an adaptive intelligence engine for iGaming operators. Sense, Act, Learn from your player data.',
  robots: { index: false, follow: false },
}

export default function LegacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <SensAiOnePager />
    </main>
  )
}
