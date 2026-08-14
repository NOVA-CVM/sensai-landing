import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './sense.css'

// Space Grotesk, RELOCKED by AA (round 8.1) — no font changes without an explicit AA order.
// Kept scoped here as well as site-wide (root layout, round 9 item 7) so this route's type
// never depends on the legacy homepage's setup.
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })

export const metadata: Metadata = {
  title: 'You have the data. What’s missing is an expert who knows every player. | sensAi',
  description:
    'sensAi gives you a digital customer manager on every player: it analyzes value, risk, churn and engagement continuously, and pushes the actions into the systems your teams already use.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'You have the data. What’s missing is an expert who knows every player.',
    description:
      'sensAi gives you a digital customer manager on every player: it analyzes value, risk, churn and engagement continuously, and pushes the actions into the systems your teams already use.',
    images: ['/og-sense.png'],
    siteName: 'sensAi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'You have the data. What’s missing is an expert who knows every player.',
    description:
      'sensAi gives you a digital customer manager on every player: it analyzes value, risk, churn and engagement continuously, and pushes the actions into the systems your teams already use.',
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
