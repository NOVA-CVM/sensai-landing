"use client"

import { useEffect } from 'react'
import { refCode, trackEvent, trackCodedEvent } from '@/lib/analytics'

/**
 * Round 10, items 2+3. Renders nothing, changes nothing on screen.
 * Fires one `visit` event (carrying the ?r= serial code if present) and then
 * one `scroll_depth` event per quarter of the page reached, once each.
 */
export function VisitTracking({ page }: { page: string }) {
  useEffect(() => {
    const r = refCode()
    trackEvent('visit', r ? { page, coded: true } : { page, coded: false })
    // Readable without Web Analytics Plus: one row per code in the Events panel — `visit_7412`.
    trackCodedEvent('visit')

    const marks = [25, 50, 75, 100]
    const fired = new Set<number>()

    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100))
      for (const m of marks) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m)
          trackEvent('scroll_depth', { page, depth: m })
        }
      }
      if (fired.size === marks.length) window.removeEventListener('scroll', onScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [page])

  return null
}
