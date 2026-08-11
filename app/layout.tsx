import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

const isVercel = process.env.VERCEL === '1'
import './globals.css'

// Site-wide typeface: Space Grotesk — nearest freely-licensed equivalent to
// getmodus.com's GT Planar (commercial). Keeps the --font-inter variable name
// so the existing font-sans chain picks it up unchanged.
const inter = Space_Grotesk({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'sensAi — A Digital Customer Manager for Every Player | Nova CVM',
  description: 'sensAi puts a digital customer manager on every player — it knows their value, watches their risk, catches their churn, and pushes the actions into the systems your teams already use.',
  generator: 'v0.app',
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {isVercel && <Analytics />}
      </body>
    </html>
  )
}
