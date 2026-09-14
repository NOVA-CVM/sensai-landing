"use client"

import { useEffect, useRef, useState } from "react"
// Generated from the film's own code. Never hand-edited here: regenerate it at source.
import { STREAMS, mountStreams } from "./streams-anim"

type Variant = 'desktop' | 'phone'

// Both variants' stylesheets open with a global `*{margin:0;padding:0}`. Injected unlayered that
// outranks everything Tailwind puts in @layer and silently zeroes utilities like mx-auto across
// the whole page, so each is scoped to the animation root before it goes in.
const scoped = (css: string, cls: string) => css.replace('*{margin:0;padding:0}', `.${cls} *{margin:0;padding:0}`)
const STREAMS_CSS = scoped(STREAMS.desktop.css, 'sa-desktop') + scoped(STREAMS.phone.css, 'sa-phone')

/**
 * "Every customer is a stream." Two variants of the same animation: the phone one has larger type
 * and shorter labels, so it stays legible without cropping. The box is scaled as a unit to the
 * container width, which means no sideways scroll at any size (round 8, §1).
 */
export function Streams({ duration = 12000 }: { duration?: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [variant, setVariant] = useState<Variant | null>(null)
  const [scale, setScale] = useState(1)

  // Pick the variant, and re-pick if the viewport crosses the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const pick = () => setVariant(mq.matches ? 'phone' : 'desktop')
    pick()
    mq.addEventListener('change', pick)
    return () => mq.removeEventListener('change', pick)
  }, [])

  // Mount (and re-mount when the variant changes: the module writes the root's class and markup).
  useEffect(() => {
    const wrap = wrapRef.current
    const root = rootRef.current
    if (!wrap || !root || !variant) return

    root.className = ''
    const api = mountStreams(root, { variant, duration })

    const fit = () => setScale(wrap.clientWidth / api.width)
    fit()
    window.addEventListener('resize', fit)

    let io: IntersectionObserver | null = null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      api.render(1)
    } else {
      io = new IntersectionObserver(([e]) => {
        // Once, on scroll-in. It ends on the fork and stays there.
        if (e.isIntersecting) { api.play(); io?.disconnect(); io = null }
      }, { threshold: 0.5 })
      io.observe(wrap)
    }

    return () => {
      window.removeEventListener('resize', fit)
      io?.disconnect()
      api.stop()
    }
  }, [variant, duration])

  const native = variant ? STREAMS[variant] : STREAMS.desktop
  return (
    <>
      <style>{STREAMS_CSS}</style>
      <div ref={wrapRef} className="sh-streams-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        <div style={{ height: Math.round(native.height * scale) }}>
          <div ref={rootRef} style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }} />
        </div>
      </div>
    </>
  )
}
