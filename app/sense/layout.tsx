import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './sense.css'

// Space Grotesk, RELOCKED by AA (round 8.1) — no font changes without an explicit AA order.
// Scoped here so the existing homepage keeps its Inter setup untouched.
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })

export const metadata: Metadata = {
  title: 'You have the data. What’s missing is an expert who analyzes every player. | sensAi',
  description:
    'sensAi gives you a digital customer manager on every player: it watches value, risk, churn and engagement, and pushes the actions into the systems your teams already use.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'You have the data. What’s missing is an expert who analyzes every player.',
    description:
      'sensAi gives you a digital customer manager on every player: it watches value, risk, churn and engagement, and pushes the actions into the systems your teams already use.',
    images: ['/og-sense.png'],
    siteName: 'sensAi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'You have the data. What’s missing is an expert who analyzes every player.',
    description:
      'sensAi gives you a digital customer manager on every player: it watches value, risk, churn and engagement, and pushes the actions into the systems your teams already use.',
    images: ['/og-sense.png'],
  },
}

export default function SenseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={grotesk.variable} style={{ fontFamily: 'var(--font-grotesk), system-ui, sans-serif' }}>
      {children}
    </div>
  )
}
