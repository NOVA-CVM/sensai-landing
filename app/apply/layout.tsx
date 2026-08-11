import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import '../sense/sense.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })

export const metadata: Metadata = {
  title: 'Apply to the design partnership | sensAi',
  description: 'We onboard a selected group of operators as design partners.',
  robots: { index: false, follow: false },
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={grotesk.variable} style={{ fontFamily: 'var(--font-grotesk), system-ui, sans-serif' }}>
      {children}
    </div>
  )
}
