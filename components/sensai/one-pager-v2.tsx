"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  ArrowRight,
} from "lucide-react"

// ─── Color tokens ───────────────────────────────────────────────────
const SENS = {
  bg: '#eef1f8',
  bgDeeper: '#e6ebf5',
  ink: '#0b1530',
  inkSoft: '#475069',
  blue: '#0c2c63',
  blueBright: '#1a44a8',
  rule: '#dfe4ee',
  card: '#ffffff',
  ok: '#3a8a5a',
  warn: '#c8732d',
  danger: '#b8345a',
  muted: '#7a849c',
} as const

const BOOKING_URL = "https://calendar.app.google/K15ZBdA3E6WBxbWXA"
const goBook = () => { window.location.href = '/book' }

// ─── Performance hooks: pause animations off-viewport, honor reduced motion ───
function useInView(margin = '200px') {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const obs = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { rootMargin: margin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])
  return { ref, inView }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

// Typewriter isolated in a leaf so per-keystroke state never re-renders the big tree.
function TypedPrompt({ text, run, cursorColor, onDone }: {
  text: string; run: boolean; cursorColor: string; onDone: () => void
}) {
  const [n, setN] = useState(0)
  const doneRef = useRef(false)
  useEffect(() => {
    doneRef.current = false
    setN(0)
    if (!run) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) {
        clearInterval(id)
        if (!doneRef.current) {
          doneRef.current = true
          setTimeout(onDone, 450)
        }
      }
    }, 38)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, run])
  return (
    <>
      {text.slice(0, n)}
      <span className="sensai-cursor-blink" style={{ display: 'inline-block', width: 2, height: 14, background: cursorColor, marginLeft: 2 }} />
    </>
  )
}

function openBooking() {
  const w = 500
  const h = 650
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2
  window.open(
    BOOKING_URL,
    "sensai-booking",
    `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes`
  )
}

// ─── Tiny layout helpers ────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: '#8fa8e0', fontSize: 13, fontWeight: 500,
      letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 24, height: 1.5, background: '#8fa8e0' }} />
      {children}
    </div>
  )
}

function SectionTitle({ children, max = 720 }: { children: React.ReactNode; max?: number }) {
  return (
    <h2 style={{
      margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1,
      lineHeight: 1.1, color: '#fff', maxWidth: max,
    }}>{children}</h2>
  )
}

function Lede({ children, max = 680 }: { children: React.ReactNode; max?: number }) {
  return (
    <p style={{
      marginTop: 16, fontSize: 17, lineHeight: 1.6,
      color: '#b6c1dd', maxWidth: max,
    }}>{children}</p>
  )
}

function SectionShell({ children, bg, padY = 88 }: {
  children: React.ReactNode; bg?: string; padY?: number
}) {
  return (
    <section style={{ padding: `${padY}px 80px`, background: bg || 'transparent' }}>
      <div className="max-w-[1280px] mx-auto">{children}</div>
    </section>
  )
}

// ─── Logo (kept from original) ──────────────────────────────────────
function Logo({ className = "", showMascot = false }: { className?: string; showMascot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {showMascot && (
        <img src="/sensai-mascot.png" alt="sensAi" className="w-14 h-14 rounded-xl" />
      )}
      <span
        className={`tracking-[0.08em] ${className}`}
        style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600 }}
      >
        sens<span style={{ textTransform: 'none', fontSize: '1.15em', fontWeight: 700 }}>A</span>i
      </span>
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SYNTH CHART COMPONENTS (inlined from synth-charts.jsx)
// ═══════════════════════════════════════════════════════════════════

function MarketCard({ children, padding = 18, style = {} }: {
  children: React.ReactNode; padding?: number; style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${SENS.rule}`,
      borderRadius: 14,
      padding,
      boxShadow: '0 24px 60px -28px rgba(15, 28, 70, 0.30), 0 6px 14px -8px rgba(15, 28, 70, 0.10)',
      color: SENS.ink,
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHead({ eyebrow, title, right }: {
  eyebrow?: string; title: string; right?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div>
        {eyebrow && (
          <div style={{
            fontSize: 10, color: SENS.muted, textTransform: 'uppercase',
            letterSpacing: '0.12em', fontWeight: 600, marginBottom: 4,
          }}>{eyebrow}</div>
        )}
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>{title}</div>
      </div>
      {right}
    </div>
  )
}

function KpiTile({ label, value, delta, tone = 'ok', sparkline }: {
  label: string; value: string; delta?: string;
  tone?: 'ok' | 'danger' | 'warn' | 'neutral'; sparkline?: string
}) {
  const color = { ok: SENS.ok, danger: SENS.danger, warn: SENS.warn, neutral: SENS.muted }[tone]
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${SENS.rule}`,
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
      minHeight: 84,
    }}>
      <div style={{ fontSize: 10, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: SENS.ink, letterSpacing: -0.6 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ fontSize: 11, color, fontWeight: 500 }}>{delta}</div>
      )}
      {sparkline && (
        <svg viewBox="0 0 100 24" style={{ width: '100%', height: 22, marginTop: 2 }} preserveAspectRatio="none">
          <path className="sensai-spark-draw" d={sparkline} stroke={color} strokeWidth="1.6" fill="none" />
        </svg>
      )}
    </div>
  )
}

function TrajectoryChart({ height = 160 }: { height?: number }) {
  return (
    <MarketCard padding={18} style={{ width: '100%' }}>
      <CardHead
        eyebrow="signal · live"
        title="Player value trajectory"
        right={
          <div style={{ fontSize: 10, color: SENS.muted, display: 'flex', gap: 14 }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: SENS.blueBright, marginRight: 5 }} />Detected</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#cbd5ec', marginRight: 5 }} />Baseline</span>
          </div>
        }
      />
      <svg viewBox="0 0 600 120" style={{ width: '100%', height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="g-traj" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SENS.blueBright} stopOpacity={0.22} />
            <stop offset="100%" stopColor={SENS.blueBright} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[24, 60, 96].map(y => (
          <line key={y} x1="0" x2="600" y1={y} y2={y} stroke={SENS.rule} strokeDasharray="2 4" />
        ))}
        <path d="M0 78 L60 76 L120 74 L180 70 L240 68 L300 64 L360 60 L420 58 L480 54 L540 50 L600 48"
          stroke="#cbd5ec" strokeWidth="1.6" strokeDasharray="3 3" fill="none" />
        <path className="sensai-area-in" d="M0 80 L40 76 L80 78 L120 70 L160 72 L200 64 L240 60 L280 50 L320 46 L360 36 L400 40 L440 28 L480 32 L520 22 L560 28 L600 18 L600 120 L0 120 Z" fill="url(#g-traj)" />
        <path className="sensai-line-draw" d="M0 80 L40 76 L80 78 L120 70 L160 72 L200 64 L240 60 L280 50 L320 46 L360 36 L400 40 L440 28 L480 32 L520 22 L560 28 L600 18"
          stroke={SENS.blueBright} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
        <circle cx="360" cy="36" r="5" fill={SENS.danger} />
        <circle cx="360" cy="36" r="11" fill={SENS.danger} fillOpacity={0.15}>
          <animate attributeName="r" values="8;16;8" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.25;0.05;0.25" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: SENS.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
        <span>Apr 1</span><span>Apr 8</span><span>Apr 15</span><span>Apr 22</span><span>Today</span>
      </div>
    </MarketCard>
  )
}

function SignalsCard() {
  const rows = [
    { tone: 'danger' as const, t: 'VIP churn signal', s: 'Account 231818894 · sessions −64%', m: '8s' },
    { tone: 'danger' as const, t: 'RAF ring · root invitee', s: '19 red nodes · ghost accounts', m: '4m' },
    { tone: 'warn' as const, t: 'Hidden VIP candidate', s: '78 active days · under threshold', m: '12m' },
    { tone: 'ok' as const, t: 'Case pushed to CRM', s: 'Retention journey · 142 accounts', m: '23m' },
  ]
  const dot: Record<string, string> = { danger: SENS.danger, warn: SENS.warn, ok: SENS.ok }
  return (
    <MarketCard padding={18} style={{ width: '100%' }}>
      <CardHead eyebrow="last 24h" title="Active signals" right={
        <div style={{ fontSize: 11, color: SENS.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>37 open</div>
      } />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={i} className="sensai-stagger" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0',
            borderBottom: i < rows.length - 1 ? `1px solid ${SENS.rule}` : 'none',
            animationDelay: `${0.5 + i * 0.22}s`,
          }}>
            <span className={i === 0 ? 'sensai-dot-pulse' : undefined} style={{ width: 8, height: 8, borderRadius: '50%', background: dot[r.tone], flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: SENS.ink, letterSpacing: -0.1 }}>{r.t}</div>
              <div style={{ fontSize: 11, color: SENS.muted, marginTop: 2 }}>{r.s}</div>
            </div>
            <span style={{ fontSize: 11, color: SENS.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{r.m}</span>
          </div>
        ))}
      </div>
    </MarketCard>
  )
}

function SignalCard({ tone = 'danger', title, sub, meta }: {
  tone?: 'danger' | 'warn' | 'ok'; title: string; sub: string; meta: string
}) {
  const dotColor = { danger: SENS.danger, warn: SENS.warn, ok: SENS.ok }[tone]
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '14px 16px',
      boxShadow: '0 18px 40px -14px rgba(15, 28, 70, 0.25), 0 4px 10px -4px rgba(15, 28, 70, 0.12)',
      border: `1px solid ${SENS.rule}`, minWidth: 240, maxWidth: 280,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />
        <span style={{ fontSize: 10, color: SENS.muted, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>{meta}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: SENS.ink, letterSpacing: -0.2 }}>{title}</div>
      <div style={{ fontSize: 12, color: SENS.inkSoft, marginTop: 4, lineHeight: 1.45 }}>{sub}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 1: NAV (sticky)
// ═══════════════════════════════════════════════════════════════════

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{
      background: 'rgba(9, 17, 38, 0.78)',
      backdropFilter: 'blur(12px)',
      borderColor: 'rgba(255,255,255,0.08)',
    }}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between" style={{ padding: '18px 80px' }}>
        <Logo className="text-xl sm:text-2xl md:text-4xl font-semibold text-white" showMascot />
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2: HERO (synthetic dashboard)
// ═══════════════════════════════════════════════════════════════════

function HeroField() {
  // Atmospheric field of players: blurred at the edges, sharpening toward a
  // focus point right of center. Deterministic — no randomness.
  const w = 1440
  const h = 860
  const cols = 36
  const rows = 20
  const fx = 0.68 * w
  const fy = 0.46 * h
  const maxD = Math.sqrt(w * w + h * h) * 0.62
  const dots: React.ReactNode[] = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const seed = (c * 7 + r * 13) % 23
      const x = (c + 0.5) * (w / cols) + ((seed % 7) - 3) * 9
      const y = (r + 0.5) * (h / rows) + (((seed * 5) % 7) - 3) * 9
      const d = Math.min(1, Math.sqrt((x - fx) ** 2 + (y - fy) ** 2) / maxD)
      // skip a clearing behind the centered type stack
      if (y < h * 0.62 && x > w * 0.22 && x < w * 0.78) continue
      if (d < 0.3) {
        dots.push(<circle key={`${c}-${r}`} cx={x} cy={y} r={1.6 + (seed % 3) * 0.5} fill="#aebfe8" opacity={0.55 - d * 0.4} />)
      } else if (d < 0.6) {
        dots.push(<circle key={`${c}-${r}`} cx={x} cy={y} r={2.4 + (seed % 3) * 0.7} fill="#8fa8e0" opacity={0.34 - d * 0.2} filter="url(#hf-soft)" />)
      } else {
        dots.push(<rect key={`${c}-${r}`} x={x - 5} y={y - 5} width={10 + (seed % 4) * 2} height={10 + (seed % 4) * 2}
          fill="#5f7cc0" opacity={0.22 - d * 0.1} filter="url(#hf-heavy)" />)
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="hf-soft"><feGaussianBlur stdDeviation="1.6" /></filter>
        <filter id="hf-heavy"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {dots}
    </svg>
  )
}

function HeroResolutionField() {
  // A clearly readable left-to-right gradient: few large blurred blobs on the
  // left resolving into a dense, crisp crowd on the right, a few players in
  // state colors at the sharp end. Structured, not bokeh. Deterministic.
  const cols = 56
  const w = 1440
  const h = 760
  const colW = w / cols
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const hexLerp = (c1: string, c2: string, t: number) => {
    const p = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
    const [r1, g1, b1] = p(c1); const [r2, g2, b2] = p(c2)
    return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`
  }
  const cells: React.ReactNode[] = []
  for (let c = 0; c < cols; c++) {
    const tCol = c / (cols - 1)
    const ease = tCol * tCol * (3 - 2 * tCol)
    const count = Math.round(lerp(2, 17, ease))
    for (let i = 0; i < count; i++) {
      const seed = (c * 7 + i * 13) % 17
      const x = Number((c * colW + colW / 2 + ((seed % 3) - 1) * 4).toFixed(1))
      const y = Number(((i + 0.5) * (h / count) + (((seed * 3) % 5) - 2) * 4).toFixed(1))
      const size = Number(lerp(30, 5, ease).toFixed(1))
      const rx = Number(Math.min(size / 2, size / 2 * ease * 2.4 + 1).toFixed(1))
      const blur = ease < 0.2 ? 'url(#hero-b3)' : ease < 0.42 ? 'url(#hero-b2)' : ease < 0.64 ? 'url(#hero-b1)' : undefined
      let color = ease < 0.55 ? hexLerp('#42598f', '#8fa8e0', ease / 0.55) : hexLerp('#8fa8e0', '#ffffff', (ease - 0.55) / 0.45)
      if (ease > 0.86) {
        if (seed === 3) color = '#5d8a72'
        else if (seed === 9) color = '#8a6b45'
        else if (seed === 14) color = '#8a5058'
      }
      const opacity = Number((0.1 + ease * 0.68).toFixed(3))
      cells.push(
        <rect key={`${c}-${i}`} x={Number((x - size / 2).toFixed(1))} y={Number((y - size / 2).toFixed(1))}
          width={size} height={size} rx={rx} fill={color} opacity={opacity} filter={blur} />
      )
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
      <defs>
        <filter id="hero-b3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="hero-b2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2" /></filter>
        <filter id="hero-b1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.3" /></filter>
      </defs>
      {cells}
    </svg>
  )
}

function Hero() {
  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <section style={{ padding: '72px 80px 120px', paddingTop: 170, background: SENS.ink, position: 'relative', overflow: 'hidden' }}>
      {/* full-bleed resolution field, slowly revealing left to right */}
      <div aria-hidden className="sensai-hero-field" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <HeroResolutionField />
      </div>
      {/* scrim for text legibility over the field */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 58% 60% at 50% 42%, rgba(11,21,48,0.95) 0%, rgba(11,21,48,0.72) 52%, rgba(11,21,48,0) 100%)',
      }} />
      <div className="max-w-[1280px] mx-auto" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            color: '#7d89a8', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.14em', marginBottom: 22,
          }}>THE DIGITAL CUSTOMER MANAGER FOR GAMING OPERATORS</div>
          <h1 style={{
            margin: 0, fontSize: 66, lineHeight: 1.08, letterSpacing: -1.8,
            fontWeight: 600, color: '#fff',
          }}>
            A million players.<br />An expert on every one.
          </h1>
          <p className="sensai-hero-subline" style={{
            margin: '22px auto 0', fontSize: 15.5, lineHeight: 1.6, color: '#b6c1dd',
            maxWidth: 560,
          }}>
            sensAi is that expert: it grows each player&rsquo;s value, protects from risk
            and abuse, and catches churn early, acting through the systems your teams
            already use.
          </p>
          <div className="sensai-hero-ctas" style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={goBook}
              style={{
                background: '#fff', color: SENS.ink, border: 'none',
                padding: '14px 26px', borderRadius: 999, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 18px 44px -14px rgba(0,0,0,0.5)',
              }}
            >
              Book a walkthrough <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToHow}
              style={{
                background: 'transparent', color: '#dfe7f8', border: '1.5px solid rgba(255,255,255,0.35)',
                padding: '13px 24px', borderRadius: 999, fontSize: 15, fontWeight: 500,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              How it works
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3: GAP ("Sound familiar?")
// ═══════════════════════════════════════════════════════════════════

function BrainWiring() {
  const ySrcOut = 62
  const ySensIn = 200
  const ySensOut = 252
  const yTilesIn = 400

  const sourceCenters = [54, 162, 270, 378, 486]
  const sensInPts = [225, 260, 280, 315]
  const sensOutPts = [220, 260, 280, 320]
  const tilesInX = [80, 200, 320, 440]

  const strandsPerLink = 3

  // Compute strands + nodes deterministically
  const { strands, nodes, dendrites } = useMemo(() => {
    const strands: Array<{
      id: number; d: string; opacity: number; w: number; primary: boolean; delay: number
    }> = []
    const nodes: Array<{ x: number; y: number; primary: boolean }> = []
    const dendrites: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    let id = 0

    function wire(sx: number, syA: number, tx: number, syB: number,
      opts: { primary: boolean; delaySeed: number }) {
      const { primary, delaySeed } = opts
      const opacity = (primary ? 0.55 : 0.22)
      const baseW = primary ? 1.4 : 1.0
      for (let s = 0; s < strandsPerLink; s++) {
        const t = (s - (strandsPerLink - 1) / 2) / strandsPerLink
        const jitterX1 = sx + t * 14
        const jitterX2 = tx + t * 14
        const cp1x = jitterX1 + (tx - sx) * 0.15 + t * 18
        const cp1y = syA + (syB - syA) * 0.35
        const cp2x = jitterX2 - (tx - sx) * 0.15 - t * 18
        const cp2y = syA + (syB - syA) * 0.65
        const mx = (jitterX1 + jitterX2) / 2 + t * 8
        const my = (syA + syB) / 2 + t * 4
        strands.push({
          id: id++,
          d: `M ${jitterX1} ${syA} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${jitterX2} ${syB}`,
          opacity, w: baseW, primary,
          delay: (delaySeed + s * 0.15) % 2.5,
        })
        if (primary && s === Math.floor(strandsPerLink / 2)) {
          nodes.push({ x: mx, y: my, primary: true })
        }
      }
    }

    // TOP TIER: 5 sources -> sensAi
    sourceCenters.forEach((sx, si) => {
      const ratio = si / (sourceCenters.length - 1)
      const targetIdx = Math.round(ratio * (sensInPts.length - 1))
      sensInPts.forEach((tx, ti) => {
        const isPrimary = ti === targetIdx
        const isCross = Math.abs(ti - targetIdx) === 1
        if (!isPrimary && !isCross) return
        wire(sx, ySrcOut, tx, ySensIn, { primary: isPrimary, delaySeed: si * 0.3 + ti * 0.2 })
      })
    })

    // BOTTOM TIER: sensAi -> 4 tools
    sensOutPts.forEach((sx, si) => {
      tilesInX.forEach((tx, ti) => {
        const isPrimary = si === ti
        const isCross = Math.abs(si - ti) === 1
        if (!isPrimary && !isCross) return
        wire(sx, ySensOut, tx, yTilesIn, { primary: isPrimary, delaySeed: si * 0.4 + ti * 0.25 + 1.0 })
      })
    })

    // Dendrites along top tier
    sourceCenters.forEach((sx, si) => {
      const ratio = si / (sourceCenters.length - 1)
      const tx = sensInPts[Math.round(ratio * (sensInPts.length - 1))]
      for (let k = 0; k < 2; k++) {
        const startY = ySrcOut + 25 + k * 40
        const startX = sx + (tx - sx) * (startY - ySrcOut) / (ySensIn - ySrcOut)
        const len = 10 + (si * 7 + k * 13) % 14
        const sign = (si + k) % 2 === 0 ? 1 : -1
        const angle = sign * (0.5 + ((si * 3 + k * 5) % 6) / 10)
        dendrites.push({
          x1: startX, y1: startY,
          x2: startX + Math.cos(angle) * len,
          y2: startY + Math.sin(angle) * len,
        })
      }
    })

    // Dendrites along bottom tier
    sensOutPts.forEach((sx, si) => {
      const tx = tilesInX[si]
      for (let k = 0; k < 2; k++) {
        const startY = ySensOut + 30 + k * 38
        const startX = sx + (tx - sx) * (startY - ySensOut) / (yTilesIn - ySensOut)
        const len = 10 + (si * 11 + k * 7) % 14
        const sign = (si + k) % 2 === 0 ? 1 : -1
        const angle = sign * (0.5 + ((si * 5 + k * 3) % 6) / 10)
        dendrites.push({
          x1: startX, y1: startY,
          x2: startX + Math.cos(angle) * len,
          y2: startY + Math.sin(angle) * len,
        })
      }
    })

    return { strands, nodes, dendrites }
  }, [])

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
      viewBox="0 0 540 480" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wire-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a44a8" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#1a44a8" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="wire-grad-soft" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7e94c8" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#7e94c8" stopOpacity={0.2} />
        </linearGradient>
      </defs>

      {dendrites.map((d, i) => (
        <line key={`d${i}`} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
          stroke="#a7b4d4" strokeWidth="0.8" strokeOpacity={0.5} strokeLinecap="round" />
      ))}

      {strands.map(s => (
        <path key={s.id} d={s.d}
          stroke={s.primary ? 'url(#wire-grad)' : 'url(#wire-grad-soft)'}
          strokeWidth={s.w} fill="none"
          strokeOpacity={s.opacity} strokeLinecap="round" />
      ))}

      {strands.filter(s => s.primary).map(s => (
        <circle key={`p${s.id}`} r="2.2" fill="#1a44a8">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${s.delay}s`} path={s.d} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.4s" repeatCount="indefinite" begin={`${s.delay}s`} />
        </circle>
      ))}

      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r={n.primary ? 3 : 2}
            fill="#fff" stroke="#1a44a8" strokeWidth={n.primary ? 1.4 : 1}
            opacity={n.primary ? 1 : 0.6} />
          {n.primary && (
            <circle cx={n.x} cy={n.y} r="3" fill="#1a44a8" opacity={0.18}>
              <animate attributeName="r" values="3;7;3" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0;0.25" dur="2.6s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* Emission / arrival markers */}
      {sourceCenters.map((sx, i) => (
        <circle key={`sc${i}`} cx={sx} cy={ySrcOut - 2} r="2" fill="#1a44a8" opacity={0.8} />
      ))}
      {sensInPts.map((tx, i) => (
        <circle key={`si${i}`} cx={tx} cy={ySensIn + 2} r="2" fill="#1a44a8" opacity={0.6} />
      ))}
      {sensOutPts.map((sx, i) => (
        <circle key={`so${i}`} cx={sx} cy={ySensOut - 2} r="2.5" fill="#1a44a8" />
      ))}
      {tilesInX.map((tx, i) => (
        <circle key={`ti${i}`} cx={tx} cy={yTilesIn + 2} r="2.5" fill="#1a44a8" opacity={0.7} />
      ))}
    </svg>
  )
}

function ArchitectureDiagram() {
  const sources = [
    { l: 'Players', icon: <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="6" r="2.4" stroke={SENS.ink} strokeWidth="1.3" fill="none"/><path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke={SENS.ink} strokeWidth="1.3" fill="none"/></svg> },
    { l: 'Sessions', icon: <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" stroke={SENS.ink} strokeWidth="1.3" fill="none"/><path d="M8 4v4l2.5 2" stroke={SENS.ink} strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg> },
    { l: 'Transactions', icon: <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 6h10M11 4l2 2-2 2M13 10H3M5 12l-2-2 2-2" stroke={SENS.ink} strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg> },
    { l: 'Game Events', icon: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="4" width="10" height="8" rx="1.5" stroke={SENS.ink} strokeWidth="1.3" fill="none"/><circle cx="6" cy="8" r="0.9" fill={SENS.ink}/><circle cx="10" cy="8" r="0.9" fill={SENS.ink}/></svg> },
    { l: 'Bonuses', icon: <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 7h10v6H3V7z" stroke={SENS.ink} strokeWidth="1.3" fill="none"/><path d="M2 5h12v2H2zM8 5v8M5 5c0-1.5 1-2 1.5-2s1.5.5 1.5 2M11 5c0-1.5-1-2-1.5-2S8 3.5 8 5" stroke={SENS.ink} strokeWidth="1.3" fill="none"/></svg> },
  ]
  const tools = [
    { l: 'CRM', icon: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="6.5" cy="7" r="2.5" stroke={SENS.ink} strokeWidth="1.4" fill="none"/><circle cx="13.5" cy="8" r="2" stroke={SENS.ink} strokeWidth="1.4" fill="none"/><path d="M2 16c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M11 15c0-1.8 1.5-3 3.5-3s3.5 1.2 3.5 3" stroke={SENS.ink} strokeWidth="1.4" fill="none"/></svg> },
    { l: 'Risk', icon: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2.5L17 5.5V11c0 3-3 5.5-7 7-4-1.5-7-4-7-7V5.5l7-3z" stroke={SENS.ink} strokeWidth="1.4" fill="none" strokeLinejoin="round"/></svg> },
    { l: 'Cases', icon: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 3h7l4 4v10H5V3z" stroke={SENS.ink} strokeWidth="1.4" fill="none" strokeLinejoin="round"/><path d="M12 3v4h4" stroke={SENS.ink} strokeWidth="1.4" fill="none"/></svg> },
    { l: 'BI', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" stroke={SENS.ink} strokeWidth="1.4" fill="none"/><path d="M3 9h14M10 9v8" stroke={SENS.ink} strokeWidth="1.4" fill="none"/></svg> },
  ]

  return (
    <div className="sensai-architecture" style={{ position: 'relative', height: 480 }}>
      {/* RAW DATA eyebrow */}
      <div style={{ position: 'absolute', top: -22, left: 0, fontSize: 10, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Raw Data</div>

      {/* Row 1: data source pills */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, zIndex: 3 }}>
        {sources.map(s => (
          <div key={s.l} style={{
            background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 10,
            padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 10px -6px rgba(15,28,70,0.1)',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#eaeef7', display: 'grid', placeItems: 'center' }}>{s.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: SENS.ink, letterSpacing: -0.1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Row 2: sensAi pill centered */}
      <div style={{
        position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)',
        background: SENS.ink, color: '#fff', borderRadius: 14,
        padding: '18px 28px', display: 'inline-flex', alignItems: 'center', gap: 16,
        boxShadow: '0 24px 50px -20px rgba(15,28,70,0.4)',
        zIndex: 3, whiteSpace: 'nowrap',
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, background: '#1d70b8', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.6"/><path d="M11 6v5l3 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>sensAi Intelligence Layer</div>
          <div style={{ fontSize: 12, color: '#9aa6c4', marginTop: 2 }}>Connects &middot; Profiles &middot; Enriches</div>
        </div>
      </div>

      {/* YOUR STACK eyebrow */}
      <div style={{ position: 'absolute', top: 354, left: 0, fontSize: 10, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Your Stack</div>

      {/* Brain wiring SVG */}
      <BrainWiring />

      {/* Row 3: tool tiles */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, zIndex: 3 }}>
        {tools.map(t => (
          <div key={t.l} style={{
            background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 12,
            padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            boxShadow: '0 6px 14px -8px rgba(15,28,70,0.12)',
            position: 'relative',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eaeef7', display: 'grid', placeItems: 'center' }}>{t.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: SENS.ink }}>{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RoleSection() {
  const duties = [
    { t: 'Grow the player’s value', s: 'LTV prediction, VIP identification and health, upsell, engagement, next best action.' },
    { t: 'Protect from risk and abuse', s: 'Bonus abuse, multi-accounting, coordinated rings, detected across the whole base.' },
    { t: 'Catch churn early', s: 'Early signals on the players worth keeping, before the value walks out the door.' },
  ]
  return (
    <section style={{ padding: '96px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto">
        <div style={{
          color: SENS.blueBright, fontSize: 13, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 24, height: 1.5, background: SENS.blueBright }} />
          The role
        </div>
        <h2 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1, lineHeight: 1.1, color: SENS.ink, maxWidth: 760 }}>
          A digital customer manager for every player.
        </h2>
        <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: 1.6, color: SENS.inkSoft, maxWidth: 680 }}>
          It watches value, risk, churn and engagement, continuously, across every account,
          and acts through the systems your teams already use. A role no B2C company could
          ever staff. Sensai makes it possible for the first time.
        </p>
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 1060 }}>
          {duties.map(d => (
            <div key={d.t}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: SENS.blueBright, flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: SENS.ink, letterSpacing: -0.2 }}>{d.t}</span>
              </div>
              <div className="sensai-card-body" style={{ fontSize: 13.5, color: SENS.inkSoft, lineHeight: 1.55, paddingLeft: 17 }}>{d.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Spark = ({ d, color }: { d: string; color: string }) => (
  <svg viewBox="0 0 100 28" style={{ width: 88, height: 24, flexShrink: 0 }} preserveAspectRatio="none">
    <path d={d} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </svg>
)

const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5,
    letterSpacing: '0.1em', color: SENS.muted, textTransform: 'uppercase', marginBottom: 10,
  }}>{children}</div>
)

const OutChip = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    display: 'inline-block', marginTop: 10, padding: '5px 10px', borderRadius: 999,
    border: '1px solid rgba(26,68,168,0.3)', background: 'rgba(26,68,168,0.06)',
    fontSize: 11, fontWeight: 500, color: SENS.blueBright,
  }}>{children}</span>
)

function ArtifactCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 14, background: '#f7f9fd', border: `1px solid ${SENS.rule}`,
      borderRadius: 12, padding: '14px 16px', maxWidth: 560,
    }}>{children}</div>
  )
}

function MiniRadar() {
  const cx = 46, cy = 40, R = 30
  const axes = 5
  const pt = (i: number, f: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / axes
    return `${(cx + R * f * Math.cos(a)).toFixed(1)},${(cy + R * f * Math.sin(a)).toFixed(1)}`
  }
  const healthy = [0.9, 0.85, 0.8, 0.9, 0.75]
  const cooled = [0.85, 0.35, 0.3, 0.4, 0.6]
  return (
    <svg viewBox="0 0 92 84" style={{ width: 92, height: 84, flexShrink: 0 }}>
      {[0.5, 1].map(f => (
        <polygon key={f} points={Array.from({ length: axes }, (_, i) => pt(i, f)).join(' ')}
          fill="none" stroke={SENS.rule} strokeWidth="0.8" />
      ))}
      <polygon points={healthy.map((f, i) => pt(i, f)).join(' ')} fill="rgba(26,68,168,0.14)" stroke={SENS.blueBright} strokeWidth="1.2" />
      <polygon points={cooled.map((f, i) => pt(i, f)).join(' ')} fill="rgba(11,21,48,0.05)" stroke={SENS.ink} strokeWidth="1.2" strokeDasharray="3 2" />
    </svg>
  )
}

const AxisFrame = () => (
  <g>
    {[30, 65].map(y => <line key={y} x1="18" x2="302" y1={y} y2={y} stroke={SENS.rule} strokeWidth="0.8" strokeDasharray="2 4" />)}
    <line x1="18" x2="302" y1="100" y2="100" stroke={SENS.rule} strokeWidth="1" />
    {[18, 89, 160, 231, 302].map(x => <line key={x} x1={x} x2={x} y1="100" y2="104" stroke={SENS.rule} strokeWidth="1" />)}
  </g>
)

const EventMark = ({ x, y, label, ly }: { x: number; y: number; label: string; ly: number }) => (
  <g>
    <line x1={x} y1={ly + 5} x2={x} y2={y - 5} stroke={SENS.blueBright} strokeWidth="0.9" strokeDasharray="2 2" />
    <rect x={x - 3} y={y - 3} width="6" height="6" transform={`rotate(45 ${x} ${y})`} fill="#fff" stroke={SENS.blueBright} strokeWidth="1.3" />
    <text x={x} y={ly} textAnchor="middle" fontSize="8.5" fill={SENS.blueBright}
      fontFamily="'JetBrains Mono', ui-monospace, monospace" letterSpacing="0.06em">{label}</text>
  </g>
)

function ValueSection() {
  const rowStyle = { fontSize: 12.5, color: SENS.inkSoft, display: 'flex', alignItems: 'center', gap: 10 } as const
  const idStyle = { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5, color: SENS.ink } as const
  const tiles: Array<{ n: string; t: string; s: string; art: React.ReactNode }> = [
    {
      n: '01', t: 'Bonus abuse & fraud prevention',
      s: 'Multi-accounting, coordinated rings, promo cycling, caught across the whole base and delivered as cases: the accounts, the pattern, the evidence.',
      art: (
        <ArtifactCard>
          <MonoLabel>A ring, delivered as a case</MonoLabel>
          <svg viewBox="0 0 320 120" style={{ width: '100%', maxWidth: 440, display: 'block' }}>
            {[...Array(24)].map((_, i) => (
              <circle key={i} cx={26 + (i % 8) * 38} cy={22 + Math.floor(i / 8) * 38} r="0.9" fill={SENS.rule} />
            ))}
            <ellipse cx="110" cy="60" rx="86" ry="42" fill="none" stroke={SENS.blueBright} strokeWidth="1.1" strokeDasharray="4 4" opacity="0.55" />
            {[[110,60],[72,40],[70,80],[118,26],[150,44],[148,80],[104,94],[178,62]].map(([x,y],i) => (
              <g key={i}>
                {i > 0 && <line x1="110" y1="60" x2={x} y2={y} stroke={SENS.ink} strokeWidth="1.1" opacity="0.3" />}
                <circle cx={x} cy={y} r={i === 0 ? 5.5 : 3.4} fill={i === 0 ? SENS.blueBright : '#fff'}
                  stroke={i === 0 ? 'none' : SENS.ink} strokeWidth="1.1" />
              </g>
            ))}
            <EventMark x={110} y={60} label="SAME PAYMENT ROUTE" ly={12} />
            <path d="M220 60 h40" stroke={SENS.blueBright} strokeWidth="1.5" />
            <rect x="262" y="46" width="44" height="28" rx="6" fill="none" stroke={SENS.blueBright} strokeWidth="1.3" />
            <path d="M272 60 l5 5 10 -11" stroke={SENS.blueBright} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <OutChip>→ Risk queue, with the evidence</OutChip>
        </ArtifactCard>
      ),
    },
    {
      n: '02', t: 'Value prediction & VIP triggers',
      s: 'Lifetime-value models on every account. Tomorrow’s VIPs flagged in their first weeks; today’s VIPs watched daily for health.',
      art: (
        <ArtifactCard>
          <MonoLabel>Lifetime value, refreshed daily</MonoLabel>
          <svg viewBox="0 0 320 120" style={{ width: '100%', maxWidth: 440, display: 'block' }}>
            <AxisFrame />
            <path d="M18 92 C 90 88, 150 72, 210 48 S 280 24, 296 22" fill="none" stroke={SENS.blueBright} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 94 C 100 92, 190 84, 296 66" fill="none" stroke={SENS.ink} strokeWidth="1.1" opacity="0.3" strokeDasharray="3 3" />
            <circle cx="296" cy="22" r="4" fill={SENS.blueBright} />
            <text x="306" y="26" fontSize="10" fill={SENS.blueBright} fontWeight="600">A</text>
            <text x="306" y="70" fontSize="10" fill={SENS.muted}>avg</text>
            <EventMark x={89} y={84} label="FLAGGED DAY 9" ly={14} />
          </svg>
          <OutChip>→ worked as cases · VIP review</OutChip>
        </ArtifactCard>
      ),
    },
    {
      n: '03', t: 'Churn prevention',
      s: 'Early disengagement signals on the players worth keeping, with the next action attached, before the value walks out the door.',
      art: (
        <ArtifactCard>
          <MonoLabel>The signal, before the drop</MonoLabel>
          <svg viewBox="0 0 320 120" style={{ width: '100%', maxWidth: 440, display: 'block' }}>
            <AxisFrame />
            <path d="M18 34 C 60 32, 100 33, 138 36" fill="none" stroke={SENS.ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <path d="M138 36 C 170 40, 186 46, 200 52" fill="none" stroke={SENS.ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <path d="M200 52 C 240 66, 272 84, 296 96" fill="none" stroke={SENS.ink} strokeWidth="1.3" strokeDasharray="4 3" opacity="0.5" />
            <EventMark x={138} y={36} label="DEPOSIT PATTERN BREAKS" ly={14} />
            <g>
              <line x1="176" y1="44" x2="176" y2="24" stroke={SENS.blueBright} strokeWidth="1.3" />
              <path d="M176 24 l12 4 -12 4 z" fill={SENS.blueBright} />
              <circle cx="176" cy="44" r="3.4" fill={SENS.blueBright} />
            </g>
            <text x="230" y="112" fontSize="8.5" fill={SENS.muted} textAnchor="middle"
              fontFamily="'JetBrains Mono', ui-monospace, monospace">PROJECTED, IF UNTOUCHED</text>
          </svg>
          <OutChip>→ CRM: retention journey, next 24h</OutChip>
        </ArtifactCard>
      ),
    },
    {
      n: '04', t: 'Game & content recommendations',
      s: 'For each player: the games they haven’t tried but will likely love, fed to your CRM campaigns and lobby tools.',
      art: (
        <ArtifactCard>
          <MonoLabel>Player to games, matched</MonoLabel>
          <svg viewBox="0 0 320 120" style={{ width: '100%', maxWidth: 440, display: 'block' }}>
            {[...Array(24)].map((_, i) => (
              <circle key={i} cx={26 + (i % 8) * 38} cy={22 + Math.floor(i / 8) * 38} r="0.9" fill={SENS.rule} />
            ))}
            <circle cx="44" cy="60" r="11" fill="none" stroke={SENS.ink} strokeWidth="1.3" />
            <circle cx="44" cy="56" r="3.6" fill="none" stroke={SENS.ink} strokeWidth="1.1" />
            <path d="M37 67 c 0 -4.5 3.5 -6.3 7 -6.3 s 7 1.8 7 6.3" fill="none" stroke={SENS.ink} strokeWidth="1.1" />
            {[0, 1, 2].map(i => (
              <g key={i}>
                <path d={`M 57 60 C 110 ${28 + i * 30}, 150 ${24 + i * 31}, 196 ${24 + i * 31}`}
                  fill="none" stroke={i === 0 ? SENS.blueBright : SENS.rule} strokeWidth={i === 0 ? 1.5 : 1.1} />
                <rect x="198" y={11 + i * 31} width="104" height="24" rx="6"
                  fill={i === 0 ? 'rgba(26,68,168,0.07)' : '#fff'} stroke={i === 0 ? SENS.blueBright : SENS.rule} strokeWidth="1.1" />
                <circle cx="212" cy={23 + i * 31} r="3.2" fill={i === 0 ? SENS.blueBright : SENS.rule} />
                <line x1="223" y1={23 + i * 31} x2="290" y2={23 + i * 31} stroke={i === 0 ? SENS.blueBright : SENS.rule} strokeWidth="2.4" strokeLinecap="round" opacity={i === 0 ? 0.5 : 0.6} />
              </g>
            ))}
            <EventMark x={128} y={44} label="AFFINITY MATCHED" ly={102} />
          </svg>
          <OutChip>→ CRM campaigns · lobby tools</OutChip>
        </ArtifactCard>
      ),
    },
    {
      n: '05', t: 'Player-profile enrichment',
      s: 'Every system you run gets a deeper picture of the player: value tier, risk signals, churn risk, game affinities, written into your CRM, risk tools and warehouse. Hundreds of enrichment columns, added to every player.',
      art: (
        <ArtifactCard>
          <MonoLabel>Columns added to every player</MonoLabel>
          <svg viewBox="0 0 320 120" style={{ width: '100%', maxWidth: 440, display: 'block' }}>
            <line x1="18" x2="302" y1="14" y2="14" stroke={SENS.rule} strokeWidth="1" />
            {[48, 78, 108, 138, 176, 206, 236, 266].map(x => (
              <line key={x} x1={x} x2={x} y1="10" y2="14" stroke={SENS.rule} strokeWidth="1" />
            ))}
            {[0, 1, 2].map(row => (
              <g key={row}>
                <circle cx="28" cy={34 + row * 28} r="6.4" fill="none" stroke={SENS.ink} strokeWidth="1.2" />
                {[0, 1, 2, 3].map(col => (
                  <rect key={col} x={44 + col * 30} y={27 + row * 28} width="22" height="14" rx="3"
                    fill="#fff" stroke={SENS.rule} strokeWidth="1.1" />
                ))}
                {[0, 1, 2, 3].map(col => (
                  <rect key={col} x={172 + col * 30} y={27 + row * 28} width="22" height="14" rx="3"
                    fill="rgba(26,68,168,0.09)" stroke={SENS.blueBright} strokeWidth="1.1" />
                ))}
              </g>
            ))}
            <EventMark x={218} y={22} label="+214 COLUMNS" ly={116} />
          </svg>
          <OutChip>→ written to CRM · DWH</OutChip>
        </ArtifactCard>
      ),
    },
    {
      n: '06', t: 'Evidence-backed answers',
      s: 'Ask about any player, segment or pattern, and get an answer built on the full context of the base, with the evidence attached.',
      art: (
        <ArtifactCard>
          <MonoLabel>A question, answered with evidence</MonoLabel>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <svg viewBox="0 0 200 110" style={{ width: 200, flexShrink: 0 }}>
              <rect x="10" y="10" width="126" height="30" rx="9" fill="none" stroke={SENS.ink} strokeWidth="1.2" opacity="0.55" />
              <text x="26" y="30" fontSize="14" fill={SENS.ink} opacity="0.7" fontWeight="600">?</text>
              <line x1="44" y1="25" x2="118" y2="25" stroke={SENS.ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.25" />
              <path d="M52 40 v12" stroke={SENS.blueBright} strokeWidth="1.2" />
              <path d="M48 48 l4 6 4 -6" fill="none" stroke={SENS.blueBright} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="10" y="60" width="176" height="32" rx="9" fill="rgba(26,68,168,0.06)" stroke={SENS.blueBright} strokeWidth="1.2" />
              <path d="M24 76 l5 5 9 -10" stroke={SENS.blueBright} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="50" y1="76" x2="126" y2="76" stroke={SENS.blueBright} strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
              <line x1="136" y1="76" x2="168" y2="76" stroke={SENS.blueBright} strokeWidth="2.2" strokeLinecap="round" opacity="0.28" />
              <text x="98" y="106" fontSize="8.5" fill={SENS.blueBright} textAnchor="middle"
                fontFamily="'JetBrains Mono', ui-monospace, monospace" letterSpacing="0.06em">EVIDENCE ATTACHED</text>
            </svg>
            <MiniRadar />
          </div>
        </ArtifactCard>
      ),
    },
  ]
  const [active, setActive] = useState(0)
  return (
    <section style={{ padding: '110px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{
              color: SENS.blueBright, fontSize: 13, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 24, height: 1.5, background: SENS.blueBright }} />
              What you get
            </div>
            <h2 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1, lineHeight: 1.1, color: SENS.ink, maxWidth: 720 }}>
              Built to grow value, stop abuse, and keep players engaged.
            </h2>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10,
            letterSpacing: '0.1em', color: SENS.muted, paddingBottom: 6,
          }}>ILLUSTRATIVE · SYNTHETIC DATA</div>
        </div>

        <div style={{ marginTop: 48, maxWidth: 880 }}>
          {tiles.map((it, i) => {
            const isActive = i === active
            return (
              <div
                key={it.n}
                className="sensai-value-row"
                onClick={() => setActive(i)}
                style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr 36px', gap: 24, alignItems: 'start',
                  padding: '22px 0', cursor: 'pointer',
                  borderTop: `1px solid ${SENS.rule}`,
                  borderBottom: i === tiles.length - 1 ? `1px solid ${SENS.rule}` : 'none',
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 300, color: isActive ? SENS.blueBright : '#b6bfd4', letterSpacing: -1, fontFeatureSettings: '"tnum"', transition: 'color 0.25s' }}>{it.n}</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: isActive ? SENS.ink : SENS.inkSoft, letterSpacing: -0.3, paddingTop: 6, transition: 'color 0.25s' }}>{it.t}</div>
                  {isActive && (
                    <div className="sensai-fade-in">
                      <div style={{ fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55, maxWidth: 560, marginTop: 8 }}>{it.s}</div>
                      {it.art}
                    </div>
                  )}
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                  marginTop: 12, justifySelf: 'end',
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s',
                }}>
                  <path d="M3 6l5 5 5-5" stroke={SENS.blueBright} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 30, fontSize: 16, fontWeight: 600, color: SENS.blueBright, maxWidth: 720, lineHeight: 1.5 }}>
          All of it lands in the systems you already run: cases, lists, triggers and enriched profiles. No new tool.
        </div>

        <div style={{ marginTop: 40 }}>
          <button
            onClick={goBook}
            style={{
              background: SENS.blue, color: '#fff', border: 'none',
              padding: '14px 26px', borderRadius: 999, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 14px 34px -12px rgba(12,44,99,0.5)',
            }}
          >
            Book a walkthrough <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

const MarkShallow = () => (
  <svg width="34" height="34" viewBox="0 0 22 22" fill="none">
    <path d="M2 7c3-2.5 6-2.5 9 0s6 2.5 9 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="6" cy="13" r="1" fill="currentColor" opacity="0.55"/>
    <circle cx="11" cy="15" r="1" fill="currentColor" opacity="0.35"/>
    <circle cx="16" cy="13.5" r="1" fill="currentColor" opacity="0.45"/>
    <circle cx="8.5" cy="18" r="1" fill="currentColor" opacity="0.2"/>
    <circle cx="14" cy="18.5" r="1" fill="currentColor" opacity="0.15"/>
  </svg>
)
const MarkDrifting = () => (
  <svg width="34" height="34" viewBox="0 0 22 22" fill="none">
    <path d="M2 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M2 11c5 0 8-1.5 11-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 2.5" opacity="0.7"/>
    <circle cx="17" cy="11" r="1.6" fill="currentColor"/>
    <circle cx="16" cy="4.5" r="1.6" fill="currentColor" opacity="0.5"/>
  </svg>
)
const MarkUntrusted = () => (
  <svg width="34" height="34" viewBox="0 0 22 22" fill="none">
    <path d="M2 11c2.6-3.6 5.8-5.5 9-5.5s6.4 1.9 9 5.5c-2.6 3.6-5.8 5.5-9 5.5S4.6 14.6 2 11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="11" cy="11" r="2.4" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 19L18 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

function ProblemSection() {
  const tiles = [
    { mark: <MarkDrifting />, t: 'Drifting models', s: <>Every change in the logic needs a data person in the loop. The analysis falls behind the business.</> },
    { mark: <MarkUntrusted />, t: 'Untrusted outputs', s: <>So the teams stop believing what the models say.</> },
    { mark: <MarkShallow />, t: 'Shallow insights', s: <>Left without models they trust, teams fall back on segments and averages.<span className="sensai-card-body"> Approximations, not understanding.</span></> },
  ]
  const stats = [
    { v: '5% → 67%', l: 'of players generate 67% of revenue', f: 'J. Gambling Studies 2024 · UKGC Patterns of Play 2022' },
    { v: '~30%', l: 'of VIPs fall below the radar', f: 'Based on our experience' },
    { v: '10–20%', l: 'of promotional spend lost to bonus abuse, gaming’s #1 fraud type', f: 'LexisNexis Risk Solutions 2026 (n=993) · SEON 2026' },
  ]
  return (
    <section style={{ padding: '104px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: SENS.blueBright, fontSize: 14, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20,
          }}>Problem</div>
          <h2 style={{ margin: '0 auto', fontSize: 46, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1.12, color: SENS.ink, maxWidth: 840 }}>
            That expert never existed.<br />So the value leaks.
          </h2>
          <p style={{ margin: '22px auto 0', fontSize: 16, lineHeight: 1.65, color: SENS.inkSoft, maxWidth: 520 }}>
            The problem is not too little data.<br />
            It&rsquo;s analysis that was never tight enough.
          </p>
        </div>

        {/* Three columns, causal order — plain columns, minimal marks, no card chrome */}
        <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, maxWidth: 1060, marginLeft: 'auto', marginRight: 'auto' }}>
          {tiles.map(tile => (
            <div key={tile.t}>
              <div style={{ color: SENS.blueBright, marginBottom: 16 }}>{tile.mark}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: SENS.ink, letterSpacing: -0.3, marginBottom: 10 }}>{tile.t}</div>
              <div style={{ fontSize: 14.5, color: SENS.inkSoft, lineHeight: 1.6 }}>{tile.s}</div>
            </div>
          ))}
        </div>

        {/* Slim proof-strip */}
        <div style={{
          marginTop: 56, maxWidth: 1060, marginLeft: 'auto', marginRight: 'auto',
          color: SENS.blueBright, fontSize: 13, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 24, height: 1.5, background: SENS.blueBright }} />
          The price of low resolution
        </div>
        <div className="sensai-proof-strip" style={{
          marginTop: 0, maxWidth: 1060, marginLeft: 'auto', marginRight: 'auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          borderTop: `1px solid ${SENS.rule}`, borderBottom: `1px solid ${SENS.rule}`,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '20px 22px',
              borderLeft: i > 0 ? `1px solid ${SENS.rule}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 5,
            }}>
              <div style={{ fontSize: 21, fontWeight: 600, color: SENS.ink, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>{s.v}</div>
              <div style={{ fontSize: 12.5, color: SENS.inkSoft, lineHeight: 1.45 }}>{s.l}</div>
              {s.f && <div style={{ fontSize: 9.5, color: SENS.muted, lineHeight: 1.4, marginTop: 2 }}>{s.f}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ResolutionVisual({ animate = true }: { animate?: boolean }) {
  // One continuous field where DENSITY grows with focus: sparse blurred blocks
  // on the left, a dense crisp crowd of players on the right. Deterministic.
  const cols = 34
  const w = 1040
  const h = 240
  const colW = w / cols
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const hexLerp = (c1: string, c2: string, t: number) => {
    const p = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
    const [r1, g1, b1] = p(c1); const [r2, g2, b2] = p(c2)
    return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`
  }
  const cells: React.ReactNode[] = []
  let focusCx = 0, focusCy = 0
  for (let c = 0; c < cols; c++) {
    const tCol = c / (cols - 1)
    const easeCol = tCol * tCol * (3 - 2 * tCol)
    // density: 3 per column on the far left, 16 on the far right
    const count = Math.round(lerp(3, 16, easeCol))
    for (let i = 0; i < count; i++) {
      const seed = (c * 7 + i * 13) % 17
      const noise = ((seed / 17) - 0.5) * 0.1
      const t = Math.min(1, Math.max(0, tCol + noise))
      const ease = t * t * (3 - 2 * t)
      const x = Number((c * colW + colW / 2 + ((seed % 5) - 2) * (2 + t * 4)).toFixed(1))
      const y = Number(((i + 0.5) * (h / count) + (((seed * 3) % 5) - 2) * 3).toFixed(1))
      const size = Number(lerp(30, 5.2, ease).toFixed(1))
      const rx = Number(Math.min(size / 2, size / 2 * ease * 2.2 + 1).toFixed(1))
      const blur = ease < 0.22 ? 'url(#res-b3)' : ease < 0.45 ? 'url(#res-b2)' : ease < 0.68 ? 'url(#res-b1)' : undefined
      let color = ease < 0.55 ? hexLerp('#5f7cc0', '#8fa8e0', ease / 0.55) : hexLerp('#8fa8e0', '#ffffff', (ease - 0.55) / 0.45)
      // In the sharpest zone only, a few players show their state: muted value-green,
      // muted risk-amber/red. High resolution shows WHO players are.
      let halo: string | null = null
      if (ease > 0.85) {
        if (seed === 3) { color = '#5d8a72'; halo = 'rgba(93,138,114,0.35)' }
        else if (seed === 9) { color = '#8a6b45'; halo = 'rgba(138,107,69,0.35)' }
        else if (seed === 14) { color = '#8a5058'; halo = 'rgba(138,80,88,0.35)' }
      }
      const opacity = Number((0.15 + ease * 0.85).toFixed(3))
      const isFocus = c === cols - 3 && i === Math.floor(count / 2)
      if (isFocus) { focusCx = x; focusCy = y }
      cells.push(
        <rect key={`${c}-${i}`} x={Number((x - size / 2).toFixed(1))} y={Number((y - size / 2).toFixed(1))}
          width={size} height={size} rx={rx} fill={color} opacity={opacity} filter={blur} />
      )
      if (halo) {
        cells.push(<rect key={`g${c}-${i}`} x={Number((x - size).toFixed(1))} y={Number((y - size).toFixed(1))}
          width={size * 2} height={size * 2} rx={size} fill={halo} filter="url(#res-b1)" />)
      } else if (ease > 0.88) {
        cells.push(<rect key={`g${c}-${i}`} x={Number((x - size).toFixed(1))} y={Number((y - size).toFixed(1))}
          width={size * 2} height={size * 2} rx={size} fill="#ffffff" opacity={0.14} filter="url(#res-b1)" />)
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="A sparse blurred field resolving into a dense crowd of sharp players">
      <defs>
        <filter id="res-b3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6.5" /></filter>
        <filter id="res-b2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="res-b1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.2" /></filter>
      </defs>
      {cells}
      <circle cx={focusCx} cy={focusCy} r="11" fill="none" stroke="#ffffff" strokeWidth="1.3" opacity="0.85">
        {animate && <animate attributeName="r" values="9;13;9" dur="3.2s" repeatCount="indefinite" />}
        {animate && <animate attributeName="opacity" values="0.85;0.3;0.85" dur="3.2s" repeatCount="indefinite" />}
      </circle>
    </svg>
  )
}

function EchoBand({ animate = true }: { animate?: boolean }) {
  const n = 42
  const w = 900
  const h = 64
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const dots: React.ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const ease = t * t * (3 - 2 * t)
    const seed = (i * 7) % 17
    const x = Number((14 + t * (w - 28)).toFixed(1))
    const y = Number((h / 2 + (((seed * 3) % 5) - 2) * 5).toFixed(1))
    const size = Number(lerp(16, 4.6, ease).toFixed(1))
    const blur = ease < 0.3 ? 'url(#echo-b2)' : ease < 0.6 ? 'url(#echo-b1)' : undefined
    let color = ease > 0.8 ? '#ffffff' : '#8fa8e0'
    if (ease > 0.85) {
      if (seed === 3) color = '#5d8a72'
      else if (seed === 9) color = '#8a6b45'
    }
    dots.push(<rect key={i} x={Number((x - size / 2).toFixed(1))} y={Number((y - size / 2).toFixed(1))}
      width={size} height={size} rx={Number(Math.min(size / 2, size / 2 * ease * 2.2 + 1).toFixed(1))}
      fill={color} opacity={Number((0.2 + ease * 0.75).toFixed(3))} filter={blur} />)
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        <filter id="echo-b2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.4" /></filter>
        <filter id="echo-b1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.3" /></filter>
      </defs>
      {dots}
      <circle cx={w - 22} cy={h / 2} r="9" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8">
        {animate && <animate attributeName="r" values="7;11;7" dur="3.2s" repeatCount="indefinite" />}
        {animate && <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3.2s" repeatCount="indefinite" />}
      </circle>
    </svg>
  )
}

function TurnSection() {
  const { ref, inView } = useInView()
  const reduced = useReducedMotion()
  return (
    <SectionShell padY={104}>
      <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: 46, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1.12, color: '#fff' }}>
          Your base, in high resolution.
        </h2>
        <p style={{ margin: '22px auto 0', fontSize: 17, lineHeight: 1.65, color: '#b6c1dd', maxWidth: 700 }}>
          Sensai&rsquo;s models work on the full picture of each account, and adapt the way
          only a human analyst could. When your business changes, the analysis changes with it.
          No data project in between. Out of a blur of a million players: every single one, in focus.
        </p>
      </div>
      <div ref={ref} style={{ marginTop: 48, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <EchoBand animate={inView && !reduced} />
      </div>
    </SectionShell>
  )
}

function MiniNetwork() {
  const nodes = [
    { x: 140, y: 60, r: 7, c: '#c43f3f' },
    { x: 92, y: 38, r: 4.5, c: '#e07a7a' },
    { x: 98, y: 82, r: 5, c: '#c43f3f' },
    { x: 178, y: 38, r: 4, c: '#a98a3b' },
    { x: 184, y: 84, r: 4.5, c: '#e07a7a' },
    { x: 60, y: 60, r: 3.5, c: '#f0b8b8' },
    { x: 48, y: 30, r: 3, c: '#c8c8c8' },
    { x: 56, y: 92, r: 3, c: '#f0b8b8' },
    { x: 218, y: 60, r: 3.5, c: '#a98a3b' },
    { x: 232, y: 32, r: 3, c: '#9bcfa6' },
    { x: 230, y: 92, r: 3, c: '#c8c8c8' },
    { x: 124, y: 22, r: 3, c: '#e07a7a' },
    { x: 156, y: 22, r: 3, c: '#e07a7a' },
    { x: 124, y: 102, r: 3, c: '#c43f3f' },
    { x: 156, y: 102, r: 3, c: '#c43f3f' },
  ]
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 5], [2, 7],
    [3, 8], [3, 9], [4, 8], [4, 10], [0, 11], [0, 12], [0, 13], [0, 14],
    [1, 11], [3, 12], [2, 13], [4, 14],
  ]
  return (
    <svg viewBox="0 0 280 124" style={{ width: '100%', height: 124, display: 'block' }}>
      {edges.map((e, i) => (
        <line key={i} x1={nodes[e[0]].x} y1={nodes[e[0]].y} x2={nodes[e[1]].x} y2={nodes[e[1]].y}
          stroke="#d8dde8" strokeWidth="0.8" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.c}
          stroke={i === 0 ? '#0d1530' : 'none'} strokeWidth={i === 0 ? 1 : 0} />
      ))}
      <circle cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r + 3} fill="none" stroke="#c89933" strokeWidth="1.2" strokeDasharray="2,2" />
    </svg>
  )
}

function MiniSpark() {
  const sessions = [82, 80, 78, 74, 70, 64, 58, 52, 44, 36, 28, 22, 16, 10]
  const risk = [12, 14, 18, 22, 28, 36, 44, 54, 64, 72, 78, 84, 88, 92]
  const w = 280, h = 120, pad = 8
  const xs = (i: number) => pad + (i / (sessions.length - 1)) * (w - pad * 2)
  const ys = (v: number) => pad + (1 - v / 100) * (h - pad * 2 - 18)
  const linePath = (data: number[]) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 120, display: 'block' }}>
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1={pad} x2={w - pad} y1={pad + p * (h - pad * 2 - 18)} y2={pad + p * (h - pad * 2 - 18)}
          stroke="#eef0f4" strokeWidth="0.6" />
      ))}
      <line x1={pad} x2={w - pad} y1={h - pad - 18} y2={h - pad - 18} stroke="#d8dde8" strokeWidth="0.8" />
      <path d={`${linePath(sessions)} L ${xs(sessions.length - 1)} ${h - pad - 18} L ${xs(0)} ${h - pad - 18} Z`}
        fill="#74b885" fillOpacity={0.12} />
      <path d={linePath(sessions)} stroke="#3f8a51" strokeWidth="1.4" fill="none" />
      <path d={linePath(risk)} stroke="#c43f3f" strokeWidth="1.4" fill="none" strokeDasharray="3,2" />
      <line x1={xs(9)} x2={xs(9)} y1={pad} y2={h - pad - 18} stroke="#c89933" strokeWidth="1" strokeDasharray="2,2" />
      <text x={xs(9) + 3} y={pad + 9} fontSize="9" fill="#a98a3b">today</text>
      <text x={xs(0)} y={h - 4} fontSize="9" fill="#9aa3b8">{"−30d"}</text>
      <text x={xs(9) - 8} y={h - 4} fontSize="9" fill="#9aa3b8">today</text>
      <text x={xs(13) - 18} y={h - 4} fontSize="9" fill="#9aa3b8">+14d</text>
      <g transform={`translate(${w - 110}, 4)`}>
        <line x1="0" y1="4" x2="10" y2="4" stroke="#3f8a51" strokeWidth="1.4" />
        <text x="14" y="7" fontSize="9" fill="#5a6b8c">sessions</text>
        <line x1="55" y1="4" x2="65" y2="4" stroke="#c43f3f" strokeWidth="1.4" strokeDasharray="3,2" />
        <text x="69" y="7" fontSize="9" fill="#5a6b8c">risk</text>
      </g>
    </svg>
  )
}

interface PromptData {
  q: string
  ctx: {
    accountId: string
    tag: string
    kpis: Array<{ l: string; v: string; neg?: boolean }>
  }
  reply: {
    title: string
    bullets: string[]
    visual?: string
    action: string
    actionKind?: string
    dwellMs?: number
  }
}

function AskSensAi() {
  const prompts: PromptData[] = [
    {
      q: "Analyze the risk profile of account 41205",
      ctx: {
        accountId: '41205',
        tag: 'Red risk · root invitee',
        kpis: [
          { l: 'Total NGR', v: '−$8.2k', neg: true },
          { l: 'Network', v: '23' },
          { l: 'Red risk', v: '19', neg: true },
          { l: 'Invites', v: '31' },
        ],
      },
      reply: {
        title: "High bonus-abuse risk · 19 red nodes",
        bullets: [
          "Root of a 23-account RAF cluster · −$8.2k aggregate NGR",
          "31 invites in a single referral chain · 5 ghost accounts never made a real deposit",
          "9 of 10 downstream actions within 24h of bonus claim",
        ],
        visual: 'network',
        action: "Flag cluster · Restrict promos · Open in RAF",
      },
    },
    {
      q: "Anything new in the last 24 hours?",
      ctx: {
        accountId: 'monitor · 24h watch',
        tag: 'Live signals · forming cluster',
        kpis: [
          { l: 'New flags', v: '12', neg: true },
          { l: 'Same pattern', v: '12 / 12' },
          { l: 'Signature match', v: '94%' },
          { l: 'Window', v: '24h' },
        ],
      },
      reply: {
        title: "12 new accounts · velocity-deposit signature forming",
        bullets: [
          "3 deposits of $200 within 8 min, then max bet, across all 12",
          "All accounts created in last 72h · same deposit timing window",
          "Behavioral match to historic March cluster · sensAi remembers",
        ],
        action: "Open cluster · Apply promo lockout",
        dwellMs: 7500,
      },
    },
    {
      q: "Add new pattern: 5+ deposits in 10 min, then max bet",
      ctx: {
        accountId: 'pattern · operator-defined',
        tag: 'Awaiting validation',
        kpis: [
          { l: 'Definition', v: 'Velocity-deposit-max' },
          { l: 'Lookback', v: '90d' },
          { l: 'Historic match', v: '47' },
          { l: 'Aggregate NGR', v: '−$9.6k', neg: true },
        ],
      },
      reply: {
        title: "Pattern saved · 47 historic matches · live detection on",
        bullets: [
          "Found in 47 accounts over trailing 90 days · −$9.6k aggregate NGR",
          "Pattern signature saved to your knowledge base",
          "New flag tag visible in Q Center: 'Velocity-deposit-max-bet'",
        ],
        action: "Approve · Deploy to live detection",
        dwellMs: 7500,
      },
    },
    {
      q: "Show me hidden VIPs we haven't recognized",
      ctx: {
        accountId: '231818894',
        tag: 'Active · standard tier',
        kpis: [
          { l: 'NGR (90d)', v: '$8,420' },
          { l: 'Active days', v: '78 / 90' },
          { l: 'Avg deposit', v: '$310' },
          { l: 'Wager mult', v: '1.3×' },
        ],
      },
      reply: {
        title: "23 hidden VIPs · below the VIP threshold",
        bullets: [
          "Steady 90-day activity, median 78 active days · no churn signal",
          "Median NGR $8.4k · under standard VIP threshold of $12k",
          "Wager multiplier 1.3× peer median · low-volatility profile",
        ],
        action: "Promote to VIP · Notify VIP team",
      },
    },
    {
      q: "Push the cluster to risk and CRM",
      ctx: {
        accountId: 'cluster · velocity-deposit',
        tag: '12 accounts · synced just now',
        kpis: [
          { l: 'Accounts', v: '12' },
          { l: 'Aggregate risk', v: '−$11k' },
          { l: 'Channels', v: 'Risk · CRM' },
          { l: 'Status', v: 'Ready' },
        ],
      },
      reply: {
        title: "Ready to sync · 12 accounts → Risk + CRM",
        bullets: [
          "Risk: open cases in your existing tool with full evidence trail",
          "CRM: tag accounts 'Promo lockout' · suppress all bonus eligibility",
          "Case notes pre-populated with signature match and timeline",
        ],
        action: "Push 12 accounts to Risk + CRM",
        actionKind: 'crm',
      },
    },
  ]

  const [promptIdx, setPromptIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'sending' | 'thinking' | 'answering' | 'settled'>('typing')
  const [crmPhase, setCrmPhase] = useState<'idle' | 'clicking' | 'syncing' | 'done'>('idle')
  const [revealedBullets, setRevealedBullets] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref: viewRef, inView } = useInView()
  const reduced = useReducedMotion()
  const animate = inView && !reduced

  const current = prompts[promptIdx]

  // Reduced motion: land on the settled state, no cycling
  useEffect(() => {
    if (!reduced) return
    setPhase('settled')
    setRevealedBullets(current.reply.bullets.length)
    setCrmPhase('done')
  }, [reduced, promptIdx, current.reply.bullets.length])

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [phase, revealedBullets, crmPhase, promptIdx])

  // Scene reset on prompt change (typing itself lives in the TypedPrompt leaf)
  useEffect(() => {
    if (reduced) return
    setPhase('typing')
    setRevealedBullets(0)
    setCrmPhase('idle')
  }, [promptIdx, reduced])

  // sending -> thinking
  useEffect(() => {
    if (phase !== 'sending' || !animate) return
    const t = setTimeout(() => setPhase('thinking'), 350)
    return () => clearTimeout(t)
  }, [phase, animate])

  // thinking -> answering
  useEffect(() => {
    if (phase !== 'thinking' || !animate) return
    const t = setTimeout(() => setPhase('answering'), 700)
    return () => clearTimeout(t)
  }, [phase, animate])

  // answering -> reveal bullets -> settled
  useEffect(() => {
    if (phase !== 'answering' || !animate) return
    let i = 0
    const tick = setInterval(() => {
      i += 1
      setRevealedBullets(i)
      if (i >= current.reply.bullets.length) {
        clearInterval(tick)
        setTimeout(() => setPhase('settled'), 600)
      }
    }, 350)
    return () => clearInterval(tick)
  }, [phase, animate, current.reply.bullets.length])

  // settled -> auto-advance (with click + CRM animations)
  useEffect(() => {
    if (phase !== 'settled' || !animate) return
    const isCrm = current.reply.actionKind === 'crm'
    if (isCrm) {
      const t1 = setTimeout(() => setCrmPhase('clicking'), 800)
      const t2 = setTimeout(() => setCrmPhase('syncing'), 1300)
      const t3 = setTimeout(() => setCrmPhase('done'), 2700)
      const t4 = setTimeout(() => setPromptIdx((promptIdx + 1) % prompts.length), 5800)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    }
    // Non-CRM frames get a button click animation, then dwell so the user can read
    const dwell = current.reply.dwellMs ?? 4000
    const t1 = setTimeout(() => setCrmPhase('clicking'), 800)
    const t2 = setTimeout(() => setCrmPhase('done'), 1100)
    const t3 = setTimeout(() => setPromptIdx((promptIdx + 1) % prompts.length), dwell)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [phase, animate, promptIdx, current.reply.actionKind, current.reply.dwellMs, prompts.length])

  return (
    <section style={{ padding: '110px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto">
      <div ref={viewRef}>
        <div>
          <div style={{
            color: SENS.blueBright, fontSize: 13, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ width: 24, height: 1.5, background: SENS.blueBright }} />
            How it works
          </div>
          <h2 style={{ margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1, lineHeight: 1.1, color: SENS.ink, maxWidth: 560 }}>
            Speak with sensAi in your own words.
          </h2>

          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 1020 }}>
            {[
              { t: 'Plain-language questions', s: 'Risk profiles, segments, anomalies. Ask in your own words.' },
              { t: 'Evidence, not just answers', s: 'Every response is grounded in the underlying data and traceable.' },
              { t: 'One click to act', s: 'Push to CRM, open a case, or route a journey from inside the answer.' },
            ].map(it => (
              <div key={it.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: SENS.blueBright, marginTop: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: SENS.ink }}>{it.t}</div>
                  <div className="sensai-card-body" style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.5, marginTop: 2 }}>{it.s}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Q Center window, nested under the section headline */}
        <div style={{ marginTop: 44, maxWidth: 920, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="sensai-demo-frame" style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${SENS.rule}`,
          boxShadow: '0 30px 60px -28px rgba(15,28,70,0.25)',
          overflow: 'hidden', position: 'relative',
        }}>
          {/* App chrome header */}
          <div style={{ background: '#0d1530', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ color: '#9aa6c4', fontSize: 12, marginLeft: 14 }}>Q Center &middot; sensAi</div>
          </div>

          {/* Background context pane */}
          <div style={{
            background: SENS.bgDeeper, padding: '20px 18px 18px', position: 'relative',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#fff', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: SENS.muted, border: `1px solid ${SENS.rule}` }}>Account &middot; {current.ctx.accountId}</div>
              <div style={{ background: '#fff', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: SENS.muted, border: `1px solid ${SENS.rule}` }}>{current.ctx.tag}</div>
            </div>
            <div className="sensai-demo-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14, opacity: 0.7 }}>
              {current.ctx.kpis.map(k => (
                <div key={k.l} style={{ background: '#fff', borderRadius: 6, padding: '8px 10px', border: `1px solid ${SENS.rule}` }}>
                  <div style={{ fontSize: 9, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: k.neg ? '#c43f3f' : SENS.ink, marginTop: 2 }}>{k.v}</div>
                </div>
              ))}
            </div>

            {/* Chat card */}
            <div style={{
              background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 12,
              padding: 16, boxShadow: '0 16px 36px -18px rgba(15,28,70,0.2)',
              marginBottom: 12, position: 'relative', height: 260, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                {/* User question */}
                {phase !== 'typing' && (
                  <div className="sensai-msg-in" style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: SENS.bgDeeper,
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                      fontSize: 11, fontWeight: 600, color: SENS.ink,
                    }}>YO</div>
                    <div style={{ flex: 1, fontSize: 14, color: SENS.ink, lineHeight: 1.5, paddingTop: 4 }}>
                      {current.q}
                    </div>
                  </div>
                )}

                {/* sensAi response */}
                {(phase === 'thinking' || phase === 'answering' || phase === 'settled') && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: SENS.ink,
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.6"/><path d="M11 6v5l3 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      {phase === 'thinking' ? (
                        <div style={{ display: 'flex', gap: 4, paddingTop: 10 }}>
                          {[0, 1, 2].map(i => (
                            <span key={i} className="sensai-dot-pulse" style={{
                              width: 6, height: 6, borderRadius: '50%', background: SENS.muted,
                              animationDelay: `${i * 0.15}s`,
                            }} />
                          ))}
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: SENS.ink, marginBottom: 8 }}>{current.reply.title}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {current.reply.bullets.slice(0, revealedBullets).map((b, i) => (
                              <div key={i} className="sensai-fade-in" style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.45, display: 'flex', gap: 8 }}>
                                <span style={{ color: SENS.blueBright, flexShrink: 0 }}>&rsaquo;</span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                          {/* Visual embed */}
                          {phase === 'settled' && current.reply.visual && (
                            <div className="sensai-fade-in" style={{
                              marginTop: 12, padding: 10, background: '#fafbfd',
                              border: `1px solid ${SENS.rule}`, borderRadius: 8,
                            }}>
                              {current.reply.visual === 'network' && <MiniNetwork />}
                              {current.reply.visual === 'spark' && <MiniSpark />}
                            </div>
                          )}
                          {/* Action row */}
                          {phase === 'settled' && (
                            <div className="sensai-fade-in" style={{
                              marginTop: 10, padding: '10px 12px',
                              background: crmPhase === 'done' ? '#eef3f0' : SENS.bgDeeper,
                              border: `1px solid ${crmPhase === 'done' ? '#a9c4b4' : SENS.rule}`,
                              borderRadius: 8,
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'background 0.35s, border-color 0.35s',
                            }}>
                              <div style={{ fontSize: 12, color: SENS.ink, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                                {current.reply.actionKind === 'crm' && (
                                  <span style={{
                                    width: 18, height: 18, borderRadius: 4, background: '#fff',
                                    border: `1px solid ${SENS.rule}`, display: 'grid', placeItems: 'center', flexShrink: 0,
                                  }}>
                                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                      <path d="M2 4.5C2 3.67 2.67 3 3.5 3h9c.83 0 1.5.67 1.5 1.5v.5H2v-.5z" fill={SENS.blueBright}/>
                                      <path d="M2 6h12v5.5c0 .83-.67 1.5-1.5 1.5h-9C2.67 13 2 12.33 2 11.5V6z" fill={SENS.blueBright} fillOpacity={0.25}/>
                                      <circle cx="5.5" cy="9.5" r="1" fill={SENS.blueBright}/>
                                      <path d="M8 9h4M8 11h3" stroke={SENS.blueBright} strokeWidth="1" strokeLinecap="round"/>
                                    </svg>
                                  </span>
                                )}
                                {current.reply.actionKind === 'crm' && crmPhase === 'done'
                                  ? '847 players pushed to CRM'
                                  : current.reply.action}
                              </div>
                              {current.reply.actionKind === 'crm' ? (
                                <button style={{
                                  background: crmPhase === 'done' ? '#3e6b52' : '#0a0a0a',
                                  color: '#fff', border: 'none',
                                  borderRadius: 999, padding: '7px 14px 7px 12px', fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer',
                                  transform: crmPhase === 'clicking' ? 'scale(0.95)' : 'scale(1)',
                                  transition: 'transform 0.15s, background 0.3s',
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  minWidth: 110, justifyContent: 'center',
                                  letterSpacing: -0.1,
                                }}>
                                  {crmPhase === 'syncing' ? (
                                    <span className="sensai-spin" style={{
                                      width: 11, height: 11, borderRadius: '50%',
                                      border: '1.5px solid rgba(255,255,255,0.35)',
                                      borderTopColor: '#fff',
                                      display: 'inline-block',
                                    }} />
                                  ) : crmPhase === 'done' ? (
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                      <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ) : (
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                      <path d="M3 8h9M9 5l3 3-3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  <span>
                                    {(crmPhase === 'idle' || crmPhase === 'clicking') && 'Push to CRM'}
                                    {crmPhase === 'syncing' && 'Syncing'}
                                    {crmPhase === 'done' && 'Pushed'}
                                  </span>
                                </button>
                              ) : (
                                <button style={{
                                  background: crmPhase === 'done' ? '#3e6b52' : '#0a0a0a',
                                  color: '#fff', border: 'none',
                                  borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer',
                                  letterSpacing: -0.1,
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  transform: crmPhase === 'clicking' ? 'scale(0.94)' : 'scale(1)',
                                  transition: 'transform 0.18s, background 0.3s',
                                  boxShadow: crmPhase === 'clicking' ? 'inset 0 2px 6px rgba(0,0,0,0.25)' : 'none',
                                }}>
                                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {crmPhase === 'done' ? 'Done' : 'Apply'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input row */}
            <div style={{
              background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 10,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 6px 14px -8px rgba(15,28,70,0.12)',
            }}>
              <span style={{ fontSize: 13, color: phase === 'typing' ? SENS.ink : SENS.muted, flex: 1, minHeight: 18, display: 'flex', alignItems: 'center' }}>
                {phase === 'typing' ? (
                  <TypedPrompt text={current.q} run={animate} cursorColor={SENS.blueBright}
                    onDone={() => setPhase('sending')} />
                ) : 'Ask sensAi…'}
              </span>
              <button style={{
                background: phase === 'typing' ? '#0a0a0a' : '#dde2ee',
                color: '#fff', border: 'none',
                width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M3 7l4-4 4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          {prompts.map((_, i) => (
            <button key={i} onClick={() => setPromptIdx(i)} style={{
              width: i === promptIdx ? 28 : 8, height: 8, borderRadius: 4,
              background: i === promptIdx ? SENS.blueBright : SENS.rule,
              border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s',
            }} aria-label={`Prompt ${i + 1}`} />
          ))}
          <span style={{ fontSize: 12, color: SENS.muted, marginLeft: 12 }}>{promptIdx + 1}/{prompts.length}</span>
        </div>
        </div>
      </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const cx = 230, cy = 230, r = 170
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]
  const pts = angles.map(a => ({ x: Math.round(cx + r * Math.cos(a)), y: Math.round(cy + r * Math.sin(a)) }))
  const labels = [
    { step: '01', label: 'SENSE', body: 'Monitors every player, every day — value, activity, risk and abuse, account health, churn. Always current.' },
    { step: '02', label: 'ACT', body: 'Pushes cases into your CRM, support, and risk systems. Your team acts with full context — no new tool, no new channel.' },
    { step: '03', label: 'LEARN', body: 'Your teams give feedback in plain language. Every approval, every reject — it keeps tuning to your business logic.' },
  ]

  return (
    <SectionShell padY={100}>
      <Eyebrow>Always current</Eyebrow>
      <SectionTitle max={680}>The hardest part isn&rsquo;t detection. It&rsquo;s staying current.</SectionTitle>
      <Lede max={640}>Promotions change, abusers adapt, players evolve. With your teams&rsquo; feedback,
      sensAi keeps tuning to your business logic &mdash; Sense. Act. Learn. Repeat.</Lede>

      <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center' }}>
        {/* Circular cycle diagram */}
        <div className="sensai-cycle-diagram" style={{ position: 'relative', width: 460, height: 460 }}>
          <svg width="460" height="460" viewBox="0 0 460 460" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={SENS.blueBright} />
              </marker>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={SENS.rule} strokeWidth="1.5" strokeDasharray="3 5" />
            {pts.map((_, i) => {
              const a1 = angles[i], a2 = angles[(i + 1) % 3]
              const trim = 0.18
              const sa = a1 + trim
              let ea = a2 - trim
              if (ea < sa) ea += 2 * Math.PI
              const sx = cx + r * Math.cos(sa), sy = cy + r * Math.sin(sa)
              const ex = cx + r * Math.cos(ea), ey = cy + r * Math.sin(ea)
              return (
                <path key={i}
                  d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
                  stroke={SENS.blueBright} strokeWidth="2" fill="none"
                  markerEnd="url(#arrow)" />
              )
            })}
          </svg>
          {/* Node bubbles */}
          {pts.map((p, i) => (
            <div key={i} style={{
              position: 'absolute', left: p.x - 65, top: p.y - 65, width: 130, height: 130,
              borderRadius: '50%', background: '#fff', border: `1.5px solid ${SENS.rule}`,
              boxShadow: '0 16px 32px -14px rgba(15,28,70,0.18)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 12, textAlign: 'center', boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: 30, fontWeight: 300, color: SENS.blueBright, lineHeight: 1, fontFeatureSettings: '"tnum"', letterSpacing: -1 }}>{labels[i].step}</div>
              <div style={{ fontSize: 13, color: SENS.ink, fontWeight: 600, marginTop: 6, letterSpacing: -0.2 }}>{labels[i].label}</div>
            </div>
          ))}
          {/* Center "Repeat" label */}
          <div style={{
            position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -50%)',
            width: 160, textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 11, color: '#7d89a8', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 500 }}>Continuous</div>
            <div style={{ fontSize: 22, color: '#fff', fontWeight: 600, marginTop: 6, letterSpacing: -0.5 }}>Repeat.</div>
          </div>
        </div>

      </div>
    </SectionShell>
  )
}

function IntegrationDiagram({ animate = true }: { animate?: boolean }) {
  // Source tables → (read access) → sensAi inside the player base → (actions out) → the teams' systems.
  const sources = [
    { name: 'Players', glyph: 'person' },
    { name: 'Deposits & payments', glyph: 'card' },
    { name: 'Gaming activity', glyph: 'dice' },
    { name: 'Sports data', glyph: 'ball' },
    { name: 'Bonuses & promos', glyph: 'gift' },
    { name: 'Sessions', glyph: 'clock' },
    { name: 'Other', glyph: 'dots' },
  ]
  const outputs = ['CRM', 'Case manager', 'Risk tools', 'BI', 'Compliance', 'Other']
  const srcYs = [84, 158, 232, 306, 380, 454, 528]
  const outYs = [120, 194, 268, 342, 416, 490]
  // Ball + node centered between the chip columns (left edge 252, right edge 872)
  const cx = 562, gy = 320, R = 148
  const nodeY = gy
  const nodeL = cx - 98
  const nodeR = cx + 98
  const dots: React.ReactNode[] = []
  for (let lat = -75; lat <= 75; lat += 15) {
    const th = (lat * Math.PI) / 180
    const ringR = R * Math.cos(th)
    const y = gy - R * Math.sin(th)
    const steps = Math.max(6, Math.round((ringR / R) * 22))
    for (let s = 0; s < steps; s++) {
      const phi = (s / steps) * Math.PI * 2 + (lat / 30)
      const x = cx + ringR * Math.sin(phi)
      const z = Math.cos(phi)
      const seed = (Math.abs(lat) * 7 + s * 13) % 19
      const rx = Number(x.toFixed(2))
      const ry = Number(y.toFixed(2))
      if (z > -0.15) {
        dots.push(<circle key={`${lat}-${s}`} cx={rx} cy={ry} r={Number((1.5 + Math.max(0, z) * 1.5).toFixed(3))}
          fill={seed % 5 === 0 ? SENS.blue : SENS.blueBright} opacity={Number((0.2 + Math.max(0, z) * 0.55).toFixed(3))} />)
      } else {
        dots.push(<circle key={`${lat}-${s}`} cx={rx} cy={ry} r={1.2} fill={SENS.blueBright} opacity={0.12} />)
      }
    }
  }
  const glyph = (kind: string, x: number, y: number) => {
    const stroke = { stroke: SENS.inkSoft, strokeWidth: 1.5, fill: 'none', opacity: 0.9 } as const
    switch (kind) {
      case 'person': return <g {...stroke}><circle cx={x + 10} cy={y - 4} r="4" /><path d={`M ${x + 2} ${y + 9} c 0 -5 4 -7 8 -7 s 8 2 8 7`} /></g>
      case 'card': return <g {...stroke}><rect x={x} y={y - 7} width="20" height="14" rx="2.5" /><path d={`M ${x} ${y - 2} h 20`} /></g>
      case 'dice': return <g {...stroke}><rect x={x + 1} y={y - 8} width="17" height="17" rx="3.5" /><circle cx={x + 6} cy={y - 3} r="1" fill={SENS.inkSoft} /><circle cx={x + 13} cy={y + 4} r="1" fill={SENS.inkSoft} /></g>
      case 'ball': return <g {...stroke}><circle cx={x + 9} cy={y} r="8" /><path d={`M ${x + 1} ${y} h 16 M ${x + 9} ${y - 8} c 4 5 4 11 0 16 M ${x + 9} ${y - 8} c -4 5 -4 11 0 16`} /></g>
      case 'gift': return <g {...stroke}><rect x={x} y={y - 3} width="20" height="11" rx="2" /><path d={`M ${x} ${y - 3} h 20 M ${x + 10} ${y - 3} v 11 M ${x + 5} ${y - 3} c -1 -6 5 -7 5 -1 M ${x + 15} ${y - 3} c 1 -6 -5 -7 -5 -1`} /></g>
      case 'dots': return <g fill={SENS.inkSoft} opacity="0.9"><circle cx={x + 3} cy={y} r="1.6" /><circle cx={x + 10} cy={y} r="1.6" /><circle cx={x + 17} cy={y} r="1.6" /></g>
      default: return <g {...stroke}><circle cx={x + 9} cy={y} r="8" /><path d={`M ${x + 9} ${y - 4} v 4 l 3 2`} /></g>
    }
  }
  return (
    <svg viewBox="0 0 1100 600" style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Source tables flowing into sensAi at the center of the player base, with actions pushed out to the teams' systems">
      <defs>
        <radialGradient id="globe-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#1a44a8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1a44a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="conn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a44a8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1a44a8" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="conn-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a44a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a44a8" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* zone labels */}
      <text x={(252 + nodeL) / 2} y="30" textAnchor="middle" fill={SENS.blueBright} fontSize="12" fontWeight="600"
        letterSpacing="0.16em">READ ACCESS IN</text>
      <text x={(nodeR + 872) / 2} y="30" textAnchor="middle" fill={SENS.blueBright} fontSize="12" fontWeight="600"
        letterSpacing="0.16em">ACTIONS OUT</text>

      {/* connectors: source tables → node edge */}
      {srcYs.map((sy, i) => {
        const ty = nodeY - 27 + i * 9
        return <path key={`in${i}`} d={`M 252 ${sy} C 360 ${sy}, 370 ${ty}, ${nodeL} ${ty}`}
          stroke="url(#conn)" strokeWidth="1.4" fill="none" />
      })}
      {/* connectors: node edge → systems */}
      {outYs.map((oy, i) => {
        const sy2 = nodeY - 22 + i * 9
        return <path key={`out${i}`} d={`M ${nodeR} ${sy2} C 760 ${sy2}, 770 ${oy}, 872 ${oy}`}
          stroke="url(#conn-out)" strokeWidth="1.4" fill="none" />
      })}
      {/* flow pulses: every pipe, brisk pace */}
      {animate && srcYs.map((sy, i) => (
        <circle key={`pin${i}`} r="2.2" fill={SENS.blueBright} opacity="0">
          <animateMotion dur="2.1s" repeatCount="indefinite" begin={`${(i * 0.32) % 2.1}s`}
            path={`M 252 ${sy} C 360 ${sy}, 370 ${nodeY - 27 + i * 9}, ${nodeL} ${nodeY - 27 + i * 9}`} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.1s" repeatCount="indefinite" begin={`${(i * 0.32) % 2.1}s`} />
        </circle>
      ))}
      {animate && outYs.map((oy, i) => (
        <circle key={`pout${i}`} r="2.2" fill={SENS.blueBright} opacity="0">
          <animateMotion dur="2.1s" repeatCount="indefinite" begin={`${(0.55 + i * 0.37) % 2.1}s`}
            path={`M ${nodeR} ${nodeY - 22 + i * 9} C 760 ${nodeY - 22 + i * 9}, 770 ${oy}, 872 ${oy}`} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.1s" repeatCount="indefinite" begin={`${(0.55 + i * 0.37) % 2.1}s`} />
        </circle>
      ))}

      {/* the player base with sensAi at its center */}
      <circle cx={cx} cy={gy} r={R + 40} fill="url(#globe-glow)" />
      {dots}
      <circle cx={cx + 62} cy={gy - 38} r="3.4" fill={SENS.blueBright} />
      <circle cx={cx + 62} cy={gy - 38} r="7.5" fill="none" stroke={SENS.blueBright} strokeWidth="1.1" opacity="0.7">
        {animate && <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />}
        {animate && <animate attributeName="opacity" values="0.8;0.25;0.8" dur="3s" repeatCount="indefinite" />}
      </circle>
      <circle cx={cx - 84} cy={gy + 30} r="3" fill={SENS.blue} />
      <circle cx={cx + 8} cy={gy + 88} r="2.8" fill={SENS.blue} />
      <text x={cx} y={gy + R + 40} textAnchor="middle" fill={SENS.muted} fontSize="11.5"
        letterSpacing="0.14em" style={{ textTransform: 'uppercase' }}>THE PLAYER BASE · EVERY DOT A PLAYER</text>

      {/* source-table chips */}
      <text x="30" y="52" fill={SENS.muted} fontSize="10.5" letterSpacing="0.16em">SOURCE TABLES</text>
      {sources.map((s, i) => (
        <g key={s.name}>
          <rect x="30" y={srcYs[i] - 26} width="222" height="52" rx="12"
            fill="#ffffff" stroke={SENS.rule} />
          {glyph(s.glyph, 48, srcYs[i])}
          <text x="84" y={srcYs[i] + 5} fill={SENS.ink} fontSize="14" fontWeight="500">{s.name}</text>
        </g>
      ))}

      {/* sensAi node, centered in the base it watches */}
      <g>
        <rect x={nodeL} y={nodeY - 34} width="196" height="68" rx="16" fill="#ffffff" stroke={SENS.rule}
          style={{ filter: 'drop-shadow(0 16px 28px rgba(15,28,70,0.22))' }} />
        <text x={cx} y={nodeY + 3} textAnchor="middle" fill="#0b1530" fontSize="23" fontWeight="700"
          letterSpacing="0.06em">sens<tspan fontSize="26">A</tspan>i</text>
        <text x={cx} y={nodeY + 22} textAnchor="middle" fill="#7a849c" fontSize="10.5"
          letterSpacing="0.12em">WATCHING EVERY PLAYER</text>
      </g>

      {/* system chips */}
      <text x="872" y="52" fill={SENS.muted} fontSize="10.5" letterSpacing="0.16em">YOUR SYSTEMS</text>
      {outputs.map((o, i) => (
        <g key={o}>
          <rect x="872" y={outYs[i] - 26} width="198" height="52" rx="12"
            fill="#ffffff" stroke={SENS.rule} />
          {o === 'Other' ? (
            <>
              {glyph('dots', 916, outYs[i])}
              <text x="950" y={outYs[i] + 5} fill={SENS.ink} fontSize="14" fontWeight="500">Other</text>
            </>
          ) : (
            <text x="971" y={outYs[i] + 5} textAnchor="middle" fill={SENS.ink} fontSize="14" fontWeight="500">{o}</text>
          )}
        </g>
      ))}
    </svg>
  )
}

function PartnershipSection() {
  return (
    <section style={{ padding: '100px 80px', background: '#ffffff', borderTop: `1px solid ${SENS.rule}` }}>
      <div className="max-w-[1280px] mx-auto" style={{ textAlign: 'center', maxWidth: 760 }}>
        <div style={{
          color: SENS.blueBright, fontSize: 13, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18,
        }}>Design partnership</div>
        <h2 style={{ margin: '0 auto', fontSize: 40, fontWeight: 600, letterSpacing: -1, lineHeight: 1.15, color: SENS.ink }}>
          We onboard selected operators.
        </h2>
        <p style={{ margin: '18px auto 0', fontSize: 16, lineHeight: 1.6, color: SENS.inkSoft, maxWidth: 620 }}>
          We onboard a selected group of operators as design partners. They get sensAi
          early, and sensAi learns their operation first.
        </p>
        <div style={{ marginTop: 30 }}>
          <button
            onClick={() => { window.location.href = '/apply' }}
            style={{
              background: '#fff', color: SENS.blueBright, border: `1.5px solid ${SENS.blueBright}`,
              padding: '13px 26px', borderRadius: 999, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
            }}
          >
            Apply to the program <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// Integration band — modus's "enterprise-grade by default" slot.
function IntegrationSection() {
  const { ref, inView } = useInView()
  const reduced = useReducedMotion()
  return (
    <section style={{ padding: '110px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto">
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          color: SENS.blueBright, fontSize: 13, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18,
        }}>Integration</div>
        <h2 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: -1, lineHeight: 1.15, color: SENS.ink }}>
          Light integration.<br />Read access in, actions out.
        </h2>
        <div style={{ margin: '22px auto 0', fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: SENS.blueBright }}>
          Scan in 48 hours. Live in 4 weeks.
        </div>
        <p style={{ margin: '16px auto 0', fontSize: 16, lineHeight: 1.6, color: SENS.inkSoft, maxWidth: 620 }}>
          Read access to the source tables. We take it from there. Outputs pushed
          back into the tools your teams run.
        </p>
        {/* Trust row (Gabi). 'Encrypted in transit and at rest' is built but HELD until
            AA/Gabi confirm the phrasing is accurate; prepend it to this list to enable. */}
        <div style={{ marginTop: 26, fontSize: 12.5, color: SENS.muted, letterSpacing: '0.02em' }}>
          {['Read-only access', 'Pseudonymized data only', 'No PII'].join(' · ')}
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Read-only source access', 'No PII required', 'Pseudonymized data only', 'Live within 4 weeks'].map(chip => (
            <span key={chip} style={{
              border: `1px solid ${SENS.rule}`, background: '#fff', borderRadius: 999,
              padding: '9px 18px', fontSize: 13, fontWeight: 500, color: SENS.inkSoft,
            }}>{chip}</span>
          ))}
        </div>
      </div>
      <div ref={ref} style={{ marginTop: 64, maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto' }}>
        <IntegrationDiagram animate={inView && !reduced} />
      </div>
      </div>
    </section>
  )
}

function ApproachSection() {
  const cards = [
    {
      t: 'Not a personalization engine.',
      s: 'Recommenders decide what content a player sees. sensAi decides what your business does about the player.',
    },
    {
      t: 'Not another dashboard.',
      s: 'It doesn’t hand you more charts. It hands your teams cases — the accounts, the pattern, the evidence.',
    },
    {
      t: 'Not a VIP chat tool.',
      s: 'It never talks to players. It’s the analytical engine behind your hosts and engagement tools — making them sharper.',
    },
    {
      t: 'Not another platform to manage.',
      s: 'No new tool, no new channel. It acts through your CRM, support and risk systems.',
    },
  ]
  return (
    <SectionShell padY={100}>
      <Eyebrow>A different approach</Eyebrow>
      <SectionTitle max={720}>
        <span style={{ color: '#7d89a8' }}>Most tools change what the player sees.</span>{' '}
        sensAi changes what your teams do.
      </SectionTitle>

      <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, maxWidth: 1000 }}>
        {cards.map(c => (
          <div key={c.t} style={{
            background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: '24px 26px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: -0.3, marginBottom: 8 }}>{c.t}</div>
            <div style={{ fontSize: 14, color: '#b6c1dd', lineHeight: 1.55 }}>{c.s}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 8: WALKTHROUGH ("See it in action") with product screenshots
// ═══════════════════════════════════════════════════════════════════

function _StepIllo_Signal_UNUSED() {
  return (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="signalFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a44a8" stopOpacity={0.18}/>
          <stop offset="100%" stopColor="#1a44a8" stopOpacity={0}/>
        </linearGradient>
      </defs>
      {[40, 70, 100].map(y => (
        <line key={y} x1="20" x2="260" y1={y} y2={y} stroke={SENS.rule} strokeWidth="1" strokeDasharray="2 4"/>
      ))}
      <line x1="20" y1="115" x2="260" y2="115" stroke={SENS.rule} strokeWidth="1.2"/>
      <path d="M20,90 L50,82 L80,86 L110,78 L140,82 L170,30 L200,75 L230,72 L260,68 L260,115 L20,115 Z" fill="url(#signalFill)"/>
      <path d="M20,90 L50,82 L80,86 L110,78 L140,82 L170,30 L200,75 L230,72 L260,68" stroke={SENS.blueBright} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
      <circle cx="170" cy="30" r="11" fill="#fff" stroke="#c43f3f" strokeWidth="2"/>
      <circle cx="170" cy="30" r="3" fill="#c43f3f"/>
      <circle cx="170" cy="30" r="18" fill="none" stroke="#c43f3f" strokeWidth="1" opacity={0.4}>
        <animate attributeName="r" from="11" to="22" dur="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <rect x="178" y="12" width="56" height="18" rx="4" fill="#c43f3f"/>
      <text x="206" y="24" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>ANOMALY</text>
    </svg>
  )
}

function StepIllo_Network() {
  const nodes = [
    { x: 60, y: 70, r: 8, hub: true },
    { x: 110, y: 35, r: 6, hub: false },
    { x: 110, y: 105, r: 6, hub: false },
    { x: 165, y: 50, r: 6, hub: false },
    { x: 165, y: 95, r: 6, hub: false },
    { x: 220, y: 30, r: 5, hub: false },
    { x: 220, y: 70, r: 5, hub: false },
    { x: 220, y: 110, r: 5, hub: false },
  ]
  const links = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [3, 6], [4, 6], [4, 7], [1, 2],
  ]
  return (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ display: 'block' }}>
      {[...Array(12)].map((_, i) => (
        <circle key={`bg${i}`} cx={20 + (i % 6) * 50} cy={25 + Math.floor(i / 6) * 90} r="0.8" fill={SENS.rule}/>
      ))}
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#c43f3f" strokeWidth="1.4" opacity={0.65}/>
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.hub && <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke="#c43f3f" strokeWidth="1" strokeDasharray="2 3" opacity={0.7}/>}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.hub ? '#c43f3f' : '#fff'} stroke="#c43f3f" strokeWidth="1.6"/>
        </g>
      ))}
      <rect x="14" y="14" width="78" height="18" rx="4" fill="#fff" stroke={SENS.rule}/>
      <circle cx="22" cy="23" r="3" fill="#c43f3f"/>
      <text x="30" y="26" fontSize="9" fill={SENS.ink} fontWeight="600" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>8 linked accounts</text>
    </svg>
  )
}

function StepIllo_Review() {
  return (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ display: 'block' }}>
      <rect x="50" y="22" width="180" height="100" rx="8" fill="#fff" stroke={SENS.rule} strokeWidth="1.2" transform="rotate(-2 140 72)" opacity={0.55}/>
      <rect x="44" y="20" width="192" height="100" rx="8" fill="#fff" stroke={SENS.rule} strokeWidth="1.4"/>
      <rect x="44" y="20" width="192" height="22" rx="8" fill={SENS.bgDeeper}/>
      <rect x="44" y="32" width="192" height="10" fill={SENS.bgDeeper}/>
      <text x="56" y="35" fontSize="9" fill={SENS.ink} fontWeight="600" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>CASE #4821 &middot; Bonus abuse</text>
      <line x1="56" y1="55" x2="158" y2="55" stroke={SENS.rule} strokeWidth="3" strokeLinecap="round"/>
      <line x1="56" y1="68" x2="190" y2="68" stroke={SENS.rule} strokeWidth="3" strokeLinecap="round"/>
      <line x1="56" y1="81" x2="140" y2="81" stroke={SENS.rule} strokeWidth="3" strokeLinecap="round"/>
      <rect x="56" y="96" width="68" height="16" rx="4" fill={SENS.blueBright}/>
      <path d="M68 104l3 3 6-6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="92" y="107" fontSize="8.5" fill="#fff" fontWeight="600" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>Approve</text>
      <rect x="130" y="96" width="56" height="16" rx="4" fill="#fff" stroke={SENS.rule}/>
      <text x="158" y="107" fontSize="8.5" fill={SENS.muted} fontWeight="500" textAnchor="middle" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>Reject</text>
      <g transform="translate(195 14) rotate(8)">
        <rect x="-22" y="-9" width="44" height="18" rx="3" fill="none" stroke="#3ec77a" strokeWidth="1.5"/>
        <text x="0" y="3" fontSize="9" fill="#3ec77a" fontWeight="700" textAnchor="middle" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>APPROVED</text>
      </g>
    </svg>
  )
}

function StepIllo_Learn() {
  return (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <marker id="arrL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SENS.blueBright}/>
        </marker>
        <marker id="arrR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SENS.blueBright}/>
        </marker>
      </defs>
      <rect x="115" y="50" width="50" height="40" rx="8" fill={SENS.blueBright} opacity={0.12}/>
      <rect x="115" y="50" width="50" height="40" rx="8" fill="none" stroke={SENS.blueBright} strokeWidth="1.6"/>
      <text x="140" y="74" fontSize="10" fill={SENS.blueBright} fontWeight="700" textAnchor="middle" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>sensAi</text>
      {[
        { y: 30, label: 'pattern' },
        { y: 70, label: 'rule' },
        { y: 110, label: 'signal' },
      ].map((s, i) => (
        <g key={`in${i}`}>
          <rect x="20" y={s.y - 8} width="56" height="16" rx="3" fill="#fff" stroke={SENS.rule}/>
          <text x="48" y={s.y + 3} fontSize="8.5" fill={SENS.inkSoft} textAnchor="middle" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>{s.label}</text>
          <path d={`M76 ${s.y} L115 ${50 + (s.y - 30) * 0.25}`} stroke={SENS.blueBright} strokeWidth="1.2" fill="none" markerEnd="url(#arrL)"/>
        </g>
      ))}
      <path d="M165 70 L210 70" stroke={SENS.blueBright} strokeWidth="1.6" fill="none" markerEnd="url(#arrR)"/>
      <g transform="translate(220 50)">
        <rect x="0" y="0" width="48" height="40" rx="4" fill="#fff" stroke={SENS.rule}/>
        <path d="M6 30 L18 22 L28 26 L42 10" stroke="#3ec77a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="42" cy="10" r="2.5" fill="#3ec77a"/>
        <text x="24" y="38" fontSize="6.5" fill={SENS.muted} textAnchor="middle" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>+12% accuracy</text>
      </g>
    </svg>
  )
}

function WalkthroughCard({ step, title, body, screenshot }: {
  step: string; title: string; body: string; screenshot: string
}) {
  return (
    <div className="sensai-walkthrough-card" style={{ background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="sensai-walkthrough-text" style={{ padding: 22, borderBottom: `1px solid ${SENS.rule}`, height: 140, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, fontFamily: "'JetBrains Mono', ui-monospace, monospace", marginBottom: 6 }}>Step {step}</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: SENS.ink, letterSpacing: -0.3, marginBottom: 6 }}>{title}</div>
        <div className="sensai-card-body" style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.55, overflow: 'hidden' }}>{body}</div>
      </div>
      <div style={{ background: SENS.bgDeeper, padding: '14px 14px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: '#fff', borderRadius: '8px 8px 0 0', border: `1px solid ${SENS.rule}`,
          borderBottom: 'none', overflow: 'hidden', flex: 1,
          boxShadow: '0 -2px 8px -4px rgba(15,28,70,0.08)',
        }}>
          <div style={{ background: '#f4f6fb', padding: '6px 10px', display: 'flex', gap: 4, borderBottom: `1px solid ${SENS.rule}` }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div className="sensai-walkthrough-image" style={{ height: 170, overflow: 'hidden' }}>
            <img src={screenshot} alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Walkthrough() {
  return (
    <SectionShell padY={96}>
      <Eyebrow>How it lands</Eyebrow>
      <SectionTitle max={620}>Every finding arrives as a case.</SectionTitle>
      <div className="sensai-card-body">
        <Lede max={720}>The accounts, the pattern, the evidence &mdash; not a black-box score &mdash; pushed
        straight into your teams&rsquo; workflows: a CRM campaign, a support ticket, the personal account
        manager, the risk tools. No new tool, no new channel. And with your teams&rsquo; feedback, it keeps
        tuning to your business logic.</Lede>
      </div>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <WalkthroughCard step="1" title="Case delivered"
          body="sensAi surfaces what needs attention: abuse rings, churning VIPs, anomalies — all triaged and ready."
          screenshot="/screenshots/daily-digest.png" />
        <WalkthroughCard step="2" title="Evidence mapped"
          body="Connects the accounts and lays out the pattern — a full evidence trail, not a score."
          screenshot="/screenshots/raf-network-new.png" />
        <WalkthroughCard step="3" title="Team reviews and confirms"
          body="Your team opens the case, reviews the 360, and approves the action."
          screenshot="/screenshots/account-360.png" />
        <WalkthroughCard step="4" title="Systems act"
          body="The action routes through your CRM, support, or risk tools — and the feedback tunes the next case."
          screenshot="/screenshots/Journeys.png" />
      </div>
      <div style={{ marginTop: 36, textAlign: 'center', fontSize: 16, fontWeight: 600, color: SENS.blueBright }}>
        All within minutes. No SQL. No analyst ticket.
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 9: WHY ("Why operators choose sensAi")
// ═══════════════════════════════════════════════════════════════════

function Why() {
  const cards = [
    { t: '17 years of customer value management encoded.', s: 'VIP playbooks, abuse patterns, churn signals — encoded from years on the operator side, not learned from scratch on your data.' },
    { t: 'Integration is light.', s: 'Read access to the source tables, no PII required, no heavy project on your side. The rest happens on ours.' },
    { t: 'Live in production today.', s: 'Running with one operator today — and onboarding a 1M+ MAU multi-brand group.' },
  ]
  return (
    <SectionShell padY={96} bg={SENS.bgDeeper}>
      <Eyebrow>Why operators choose sensAi</Eyebrow>
      <SectionTitle max={680}>Built by operators, run with your teams.</SectionTitle>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {cards.map(c => (
          <div key={c.t} style={{ background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: SENS.blueBright, marginTop: 9, flexShrink: 0 }} />
              <div style={{ fontSize: 17, fontWeight: 600, color: SENS.ink, letterSpacing: -0.3, lineHeight: 1.3 }}>{c.t}</div>
            </div>
            <div className="sensai-card-body" style={{ fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55, paddingLeft: 20 }}>{c.s}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 10: CTA ("Early Operator Program")
// ═══════════════════════════════════════════════════════════════════

function CTA() {
  return (
    <section style={{ padding: '110px 80px', background: SENS.ink, position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* soft radial glow */}
      <div style={{
        position: 'absolute', width: 640, height: 640, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,68,168,0.35) 0%, rgba(26,68,168,0) 70%)',
        top: -260, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
      }} />
      <div className="max-w-[1280px] mx-auto" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            color: '#8fa8e0', fontSize: 13, fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 16,
          }}>Quick customer base scan</div>
          <h2 style={{ margin: 0, fontSize: 52, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.08, color: '#fff' }}>
            See where the revenue leaks. In 48 hours.
          </h2>
          <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6, color: '#b6c1dd' }}>
            Give us a sample of your data. 48 hours later you get a full scan of your
            base: value, risk and churn, player by player. No integration, nothing
            to prepare.
          </p>

          {/* the scan mini-path: sample in → 48h → the scan itself */}
          <div className="sensai-scan-path" style={{
            marginTop: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <span style={{
              border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999, padding: '8px 16px',
              fontSize: 13, color: '#dfe7f8', fontWeight: 500,
            }}>Sample in</span>
            <svg width="26" height="10" viewBox="0 0 26 10" fill="none"><path d="M0 5h22M18 1l5 4-5 4" stroke="#8fa8e0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{
              border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999, padding: '8px 16px',
              fontSize: 13, color: '#dfe7f8', fontWeight: 500,
            }}>48 hours</span>
            <svg width="26" height="10" viewBox="0 0 26 10" fill="none"><path d="M0 5h22M18 1l5 4-5 4" stroke="#8fa8e0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              border: '1px solid rgba(143,168,224,0.45)', background: 'rgba(143,168,224,0.08)',
              borderRadius: 12, padding: '8px 14px',
            }}>
              <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
                <rect x="1" y="1" width="24" height="30" rx="4" stroke="#8fa8e0" strokeWidth="1.2" />
                <line x1="5" y1="8" x2="17" y2="8" stroke="#8fa8e0" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="5" y1="14" x2="21" y2="14" stroke="#5d8a72" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="5" y1="19" x2="19" y2="19" stroke="#8a6b45" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="5" y1="24" x2="15" y2="24" stroke="#8a5058" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 12.5, color: '#dfe7f8', lineHeight: 1.4, textAlign: 'left' }}>
                Your scan: value, risk, churn,<br />player by player
              </span>
            </span>
          </div>

          <div style={{ marginTop: 32 }}>
            <button
              onClick={goBook}
              style={{
                background: '#fff', color: SENS.ink, border: 'none',
                padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: '0 18px 44px -14px rgba(0,0,0,0.5)',
              }}
            >
              Book a walkthrough <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Credibility suffix */}
          <div style={{
            marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)',
            fontSize: 13.5, lineHeight: 1.7, color: '#9aa6c4', maxWidth: 680,
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            Built by people who spent years inside online gaming.
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 11: FOOTER
// ═══════════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${SENS.rule}`, padding: '14px 80px', background: '#ffffff' }}>
      <div className="max-w-[1280px] mx-auto flex justify-between items-center" style={{ minHeight: 34 }}>
        <Logo className="text-base font-semibold" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontSize: 12.5, color: SENS.inkSoft }}>A digital customer manager for every player</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: SENS.inkSoft }}>
            <span className="sensai-heartbeat" style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4f8a68', display: 'inline-block',
            }} />
            Live in production.
          </span>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL CSS KEYFRAMES
// ═══════════════════════════════════════════════════════════════════

// Animations are defined in globals.css

// ═══════════════════════════════════════════════════════════════════
// SOCIAL PROOF (right after hero)
// ═══════════════════════════════════════════════════════════════════

function SocialProof() {
  const proofs = [
    { stat: 'Live', label: 'In production today' },
    { stat: '400K+', label: 'Accounts analyzed nightly' },
    { stat: '100s', label: 'Behavioral sensors running daily' },
  ]
  return (
    <section style={{ padding: '32px 80px', background: SENS.bg, borderTop: `1px solid ${SENS.rule}`, borderBottom: `1px solid ${SENS.rule}` }}>
      <div className="max-w-[1280px] mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, alignItems: 'center' }}>
        {proofs.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: SENS.ink, letterSpacing: -0.5 }}>{p.stat}</div>
            <div style={{ fontSize: 13, color: SENS.inkSoft, fontWeight: 500 }}>{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// FOUNDERS (before CTA)
// ═══════════════════════════════════════════════════════════════════

function Founders() {
  const team = [
    { name: 'Amit Assa', role: 'CEO', bio: '17 years in customer value management across iGaming and digital platforms.' },
    { name: 'Gabi Dvir', role: 'Co-founder', bio: '20+ years in tech leadership. Ex-VP DevOps at 888 and Fiverr.' },
  ]
  return (
    <SectionShell padY={96}>
      <Eyebrow>Who&rsquo;s building this</Eyebrow>
      <SectionTitle max={620}>Built by operators, for operators.</SectionTitle>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 880 }}>
        {team.map(t => (
          <div key={t.name} style={{
            background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 14,
            padding: 24, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: SENS.ink, letterSpacing: -0.3 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: SENS.blueBright, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.role}</div>
            <div style={{ fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55, marginTop: 4 }}>{t.bio}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTED PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function SensAiOnePagerV2() {
  return (
    <div className="sensai-page" style={{ background: SENS.ink, color: '#fff', width: '100%', minHeight: '100vh' }}>
      {/*
        ─── PARKED SECTIONS (defined above, currently NOT rendered) ───
        <SocialProof />  — "Live · 400K+ accounts · 100s sensors" strip.
        <Founders />     — Amit + Gabi founder cards (credibility now lives
                           as a suffix inside <CTA />).
        Re-enable by dropping them back into the section list below.
      */}
      <Nav />
      <Hero />
      <ProblemSection />
      <TurnSection />
      <RoleSection />
      <ValueSection />
      <div id="how-it-works">
        <AskSensAi />
      </div>
      <IntegrationSection />
      <PartnershipSection />
      <CTA />
      <Footer />
    </div>
  )
}
