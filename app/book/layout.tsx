import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '../sense/sense.css'

const grotesk = Geist({ subsets: ['latin'], variable: '--font-grotesk' })

export const metadata: Metadata = {
  title: 'Book a walkthrough | sensAi',
  description: 'Tell us a little about your operation. We take it from there.',
  robots: { index: false, follow: false },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={grotesk.variable} style={{ fontFamily: 'var(--font-grotesk), system-ui, sans-serif' }}>
      {children}
    </div>
  )
}
