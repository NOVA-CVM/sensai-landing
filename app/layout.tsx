import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

const isVercel = process.env.VERCEL === '1'
import './globals.css'

// Space Grotesk site-wide (round 9, item 7 — AA: the ENTIRE site, not only /sense).
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const TITLE = 'Sensai · stops the revenue leaks in your customer base'
const DESC = 'Sensai stops the revenue leaks in your customer base, so you can focus on growth. Bonus abuse, silent VIP churn, customers lost to product failures: found, actioned through the systems your teams already run.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getsensai.co'),
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC, images: ['/og-home.png'], siteName: 'Sensai', type: 'website', url: 'https://www.getsensai.co' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og-home.png'] },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} font-sans antialiased`}>
        {children}
        {isVercel && <Analytics />}
      </body>
    </html>
  )
}
