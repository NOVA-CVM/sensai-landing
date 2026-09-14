import type { Metadata } from 'next'
import { SensaiHomeCro } from "@/components/sensai/home-cro"

// The CRO-facing version of the home page, for comparison against `/`. Noindex until it is
// promoted: two near-identical pages in the index would compete with each other.
export const metadata: Metadata = {
  title: 'sensAi · stops the revenue leaks, so you can focus on growth',
  robots: { index: false, follow: false },
}

export default function CroPage() {
  return (
    <main className="min-h-screen">
      <SensaiHomeCro />
    </main>
  )
}
