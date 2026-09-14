"use client"

import { useEffect, useRef, useState } from "react"
// Generated from the film's own code. Never hand-edited here: regenerate it at source.
import { STREAMS_CSS, mountStreams } from "./streams-anim"

/**
 * "Every customer is a stream." The module renders a fixed 1000x560 box whose HUD is positioned
 * in px of that box, so the whole root is scaled as a unit rather than letting the SVG scale and
 * the labels shrink out of legibility.
 *
 * Desktop: scale to the wrapper's width.
 * Phone (<=768px): render at 640px and show the left part of it, per the brief. At 360px the
 * film's 10.5px mono would be ~3.8px if we scaled the whole 1000px box to fit.
 */
export function Streams({ duration = 12000 }: { duration?: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [boxW, setBoxW] = useState(1000)

  useEffect(() => {
    const wrap = wrapRef.current
    const root = rootRef.current
    if (!wrap || !root) return

    const api = mountStreams(root, { duration })

    const fit = () => {
      const w = wrap.clientWidth
      const phone = window.matchMedia('(max-width: 768px)').matches
      // The module's root is a fixed 1000px box. Desktop scales it to the column. A phone renders
      // it at 640px instead of ~360px, because at 360 the film's 10.5px mono would be 3.8px; the
      // wrapper then shows the left of it and scrolls sideways.
      const target = phone ? 640 : Math.min(1000, w)
      setBoxW(target)
      setScale(target / 1000)
    }
    fit()
    window.addEventListener('resize', fit)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let io: IntersectionObserver | null = null
    if (reduced) {
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
  }, [duration])

  // The module's stylesheet opens with a global `*{margin:0;padding:0}`. Injected as-is it is
  // UNLAYERED, so it outranks everything Tailwind puts in @layer and silently zeroes utilities
  // like mx-auto across the whole page. Scoping that one selector to the animation fixes it
  // without touching the generated module.
  const scopedCss = STREAMS_CSS.replace('*{margin:0;padding:0}', '.sa-root *{margin:0;padding:0}')

  return (
    <>
      <style>{scopedCss}</style>
      <div
        ref={wrapRef}
        className="sh-streams-wrap"
        style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}
      >
        <div style={{ width: boxW, height: Math.round(560 * scale) }}>
          <div
            ref={rootRef}
            style={{ transform: `scale(${scale})`, transformOrigin: '0 0', position: 'relative' }}
          />
        </div>
      </div>
    </>
  )
}
