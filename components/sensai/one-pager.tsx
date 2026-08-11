"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  MessageSquare,
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
      color: SENS.blueBright, fontSize: 13, fontWeight: 500,
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 24, height: 1.5, background: SENS.blueBright }} />
      {children}
    </div>
  )
}

function SectionTitle({ children, max = 720 }: { children: React.ReactNode; max?: number }) {
  return (
    <h2 style={{
      margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: -1,
      lineHeight: 1.1, color: SENS.ink, maxWidth: max,
    }}>{children}</h2>
  )
}

function Lede({ children, max = 680 }: { children: React.ReactNode; max?: number }) {
  return (
    <p style={{
      marginTop: 16, fontSize: 17, lineHeight: 1.55,
      color: SENS.inkSoft, maxWidth: max,
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
          <path d={sparkline} stroke={color} strokeWidth="1.6" fill="none" />
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
        <path d="M0 80 L40 76 L80 78 L120 70 L160 72 L200 64 L240 60 L280 50 L320 46 L360 36 L400 40 L440 28 L480 32 L520 22 L560 28 L600 18 L600 120 L0 120 Z" fill="url(#g-traj)" />
        <path d="M0 80 L40 76 L80 78 L120 70 L160 72 L200 64 L240 60 L280 50 L320 46 L360 36 L400 40 L440 28 L480 32 L520 22 L560 28 L600 18"
          stroke={SENS.blueBright} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
        <circle cx="360" cy="36" r="5" fill={SENS.danger} />
        <circle cx="360" cy="36" r="11" fill={SENS.danger} fillOpacity={0.15} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: SENS.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
        <span>Apr 1</span><span>Apr 8</span><span>Apr 15</span><span>Apr 22</span><span>Today</span>
      </div>
    </MarketCard>
  )
}

function SignalsCard() {
  const rows = [
    { tone: 'danger' as const, t: 'Bonus chain detected', s: '8 accounts · auto-flag', m: '12s' },
    { tone: 'warn' as const, t: 'VIP cooldown · #4421', s: '3.2× avg session', m: '4m' },
    { tone: 'ok' as const, t: 'Reactivation window opened', s: '142 dormant players', m: '11m' },
    { tone: 'warn' as const, t: 'Promo abuse cluster', s: 'Network of 14 nodes', m: '23m' },
  ]
  const dot: Record<string, string> = { danger: SENS.danger, warn: SENS.warn, ok: SENS.ok }
  return (
    <MarketCard padding={18} style={{ width: '100%' }}>
      <CardHead eyebrow="last 24h" title="Active signals" right={
        <div style={{ fontSize: 11, color: SENS.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>37 open</div>
      } />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0',
            borderBottom: i < rows.length - 1 ? `1px solid ${SENS.rule}` : 'none',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot[r.tone], flexShrink: 0 }} />
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
      background: 'rgba(238, 241, 248, 0.85)',
      backdropFilter: 'blur(12px)',
      borderColor: SENS.rule,
    }}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between" style={{ padding: '18px 80px' }}>
        <Logo className="text-xl sm:text-2xl md:text-4xl font-semibold text-foreground" showMascot />
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all hover:opacity-90"
          style={{ background: SENS.blue }}
        >
          <MessageSquare className="w-4 h-4" />
          Talk to sensAi
        </Link>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2: HERO (synthetic dashboard)
// ═══════════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section style={{ padding: '72px 80px 100px', paddingTop: 140, background: SENS.bg }}>
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-14 items-center">
        {/* Left: copy */}
        <div>
          <div style={{
            color: SENS.blueBright, fontSize: 13, fontWeight: 500,
            letterSpacing: '0.14em', marginBottom: 20,
          }}>ADAPTIVE INTELLIGENCE FOR IGAMING</div>
          <h1 style={{
            margin: 0, fontSize: 64, lineHeight: 1.05, letterSpacing: -1.5,
            fontWeight: 600, color: SENS.ink,
          }}>
            The brain behind your player management.
          </h1>
          <p style={{
            marginTop: 24, fontSize: 17, lineHeight: 1.55, color: SENS.inkSoft,
            maxWidth: 480,
          }}>
            sensAi watches your players, spots what matters &mdash; abuse,
            churn, value shifts &mdash; and acts through your existing stack.
            Your team gives feedback, sensAi learns. Repeat.
          </p>
          <button
            onClick={openBooking}
            style={{
              marginTop: 28, background: SENS.blue, color: '#fff', border: 'none',
              padding: '14px 26px', borderRadius: 999, fontSize: 15, fontWeight: 500,
              cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: 10,
            }}
          >
            Book a Demo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: synthetic dashboard composition */}
        <div className="relative hidden lg:block" style={{ height: 540 }}>
          {/* Trajectory chart */}
          <div style={{ position: 'absolute', top: 30, left: 0, width: 600, zIndex: 1 }}>
            <TrajectoryChart height={170} />
          </div>
          {/* KPI strip */}
          <div style={{ position: 'absolute', top: 290, left: 0, width: 600, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, zIndex: 1 }}>
            <KpiTile label="Churn risk" value="8.4%" delta="+1.2 vs baseline" tone="danger" sparkline="M0 18 L20 16 L40 14 L60 10 L80 6 L100 4" />
            <KpiTile label="VIP retention" value="92%" delta={"−0.4 pp"} tone="warn" sparkline="M0 8 L20 10 L40 9 L60 12 L80 14 L100 16" />
            <KpiTile label="Bonus abuse" value="37" delta="flagged · 8 auto" tone="danger" sparkline="M0 14 L20 12 L40 10 L60 8 L80 6 L100 4" />
            <KpiTile label="Net deposit" value="$1.84M" delta="+6.2%" tone="ok" sparkline="M0 18 L20 14 L40 12 L60 9 L80 6 L100 3" />
          </div>
          {/* Signals card floating right */}
          <div style={{ position: 'absolute', top: 0, right: -10, width: 320, zIndex: 3 }}>
            <SignalsCard />
          </div>
          {/* small callout pinned bottom-right */}
          <div style={{ position: 'absolute', bottom: 0, right: 30, zIndex: 4, transform: 'rotate(-1deg)' }}>
            <SignalCard tone="ok" meta="action · in flight"
              title="Retention offer routed"
              sub="142 dormant VIPs · pushed via Q Center." />
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3: GAP ("Sound familiar?")
// ═══════════════════════════════════════════════════════════════════

const IconBars = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 16V11M9 16V5M15 16V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
const IconCog = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M4.3 15.7l1.8-1.8M13.9 6.1l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3l8 14H2L10 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 8v3M10 13.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>

function GapCard({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 24, height: 24, color: SENS.blueBright, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
        <div style={{ fontSize: 16, fontWeight: 600, color: SENS.ink }}>{title}</div>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55 }}>{body}</p>
    </div>
  )
}

function GapSection() {
  return (
    <SectionShell bg={SENS.bgDeeper}>
      <Eyebrow>Sound familiar?</Eyebrow>
      <SectionTitle>Data is everywhere. Insights aren&rsquo;t.</SectionTitle>
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <GapCard icon={<IconBars />} title="Bottlenecked insights" body="Every analysis starts with a brief and a queue. Bandwidth is limited &mdash; questions wait." />
        <GapCard icon={<IconCog />} title="Black-box outputs" body="When teams can&rsquo;t understand why a model reached its answer, they stop trusting it &mdash; and stop using it." />
        <GapCard icon={<IconAlert />} title="Blind spots" body="Abuse networks, churning VIPs, shifting segments &mdash; found too late." />
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 4: WHAT SENSAI DOES (architecture + brain wiring)
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

function WhatItDoesSection() {
  const features = [
    { icon: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 14V9M7 14V4M12 14V7M16 14V11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,
      t: 'KPI Monitoring & Alerts', s: 'Continuous monitoring with intelligent anomaly detection and real-time alerts.' },
    { icon: <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 15c0-2.5 2-4 4-4s4 1.5 4 4M10 14c0-1.8 1.5-3 3-3s3 1.2 3 3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
      t: 'Automatic Customer Profiling', s: 'Abuse detection, VIP identification, churn risk, and account health — per customer.' },
    { icon: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="4" width="12" height="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="3" y="8.5" width="12" height="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="3" y="13" width="9" height="2" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
      t: 'Ad Hoc Customer Lists', s: 'Targeted segments based on any combination of behavioral and profile criteria.' },
    { icon: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 2L15 5.5V12L9 15.5L3 12V5.5L9 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/><path d="M9 2v13.5M3 5.5l6 3 6-3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
      t: 'Enriched Analytics', s: 'LTV predictions, game recommendations, bonus calculators — wired into your tools.' },
  ]

  return (
    <SectionShell padY={96}>
      <Eyebrow>Capabilities &amp; Architecture</Eyebrow>
      <SectionTitle max={580}>What sensAi does.</SectionTitle>
      <Lede max={620}>sensAi connects to your data, builds a living intelligence layer on every customer, and wires it into the systems your teams already use — enriching them, not replacing them.</Lede>

      <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        {/* feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: '#eaeef7', color: SENS.blueBright,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: SENS.ink, marginBottom: 4 }}>{f.t}</div>
                <div style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.55 }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>

        {/* architecture diagram */}
        <ArchitectureDiagram />
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5: HOW IT WORKS (Sense -> Act -> Learn)
// ═══════════════════════════════════════════════════════════════════

function HowItWorks() {
  const cx = 230, cy = 230, r = 170
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]
  const pts = angles.map(a => ({ x: Math.round(cx + r * Math.cos(a)), y: Math.round(cy + r * Math.sin(a)) }))
  const labels = [
    { step: '01', label: 'SENSE', body: 'Continuously analyzes your customer base — value shifts, abuse signals, churn risk. Always current.' },
    { step: '02', label: 'ACT', body: 'Pushes intelligence to your CRM, case management, and risk systems. Your team acts with full context.' },
    { step: '03', label: 'LEARN', body: 'Your team teaches sensAi in plain language. The system gets smarter with every decision.' },
  ]

  return (
    <SectionShell padY={96} bg={SENS.bgDeeper}>
      <Eyebrow>How sensAi works</Eyebrow>
      <SectionTitle max={620}>Sense. Act. Learn. Repeat.</SectionTitle>
      <Lede>A continuous loop, not a one-shot model. Every decision your team makes teaches the system.</Lede>

      <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '460px 1fr', gap: 80, alignItems: 'center' }}>
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
            <div style={{ fontSize: 11, color: SENS.muted, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 500 }}>Continuous</div>
            <div style={{ fontSize: 22, color: SENS.ink, fontWeight: 600, marginTop: 6, letterSpacing: -0.5 }}>Repeat.</div>
          </div>
        </div>

        {/* Right-side step descriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {labels.map(l => (
            <div key={l.step} style={{ display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 22, color: SENS.blueBright, fontWeight: 300, width: 36, flexShrink: 0, paddingTop: 0, lineHeight: 1, letterSpacing: -0.5, fontFeatureSettings: '"tnum"' }}>{l.step}</div>
              <div>
                <div style={{ fontSize: 15, color: SENS.ink, fontWeight: 600, letterSpacing: -0.2, marginBottom: 6 }}>{l.label}</div>
                <div style={{ fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55, maxWidth: 460 }}>{l.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 6: ASK IN PLAIN LANGUAGE (chat demo)
// ═══════════════════════════════════════════════════════════════════

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
  }
}

function AskSensAi() {
  const prompts: PromptData[] = [
    {
      q: "Analyze the risk profile of account 16062290",
      ctx: {
        accountId: '16062290',
        tag: 'Red risk · root invitee',
        kpis: [
          { l: 'Total NGR', v: '−$131.5k', neg: true },
          { l: 'Network', v: '1,221' },
          { l: 'Red risk', v: '1,206', neg: true },
          { l: 'Invites', v: '1,384' },
        ],
      },
      reply: {
        title: "High bonus-abuse risk · 1,206 red nodes",
        bullets: [
          "Root of a 1,221-account RAF cluster · −$131.5k aggregate NGR",
          "1,384 invites from one device fingerprint · 8 ghost accounts",
          "97% of downstream activity within 24h of bonus claim",
        ],
        visual: 'network',
        action: "Flag cluster · Restrict promos · Open in RAF",
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
        title: "23 hidden VIPs · projected lift $52k / mo",
        bullets: [
          "Steady 90-day activity, median 78 active days · no churn signal",
          "Median NGR $8.4k · under standard VIP threshold of $12k",
          "Wager multiplier 1.3× peer median · low-volatility profile",
        ],
        action: "Promote to VIP · Notify VIP team",
      },
    },
    {
      q: "Which players are about to churn?",
      ctx: {
        accountId: '356828175',
        tag: 'Cooling · was weekly depositor',
        kpis: [
          { l: 'NGR (30d)', v: '−$420', neg: true },
          { l: 'Sessions', v: '−68%', neg: true },
          { l: 'Last dep.', v: '23 days' },
          { l: 'LTV', v: '$14.2k' },
        ],
      },
      reply: {
        title: "847 at-risk players · next 14 days",
        bullets: [
          "Session frequency dropped 60%+ vs trailing 90-day baseline",
          "No deposit in 21+ days (median was 4.8 days)",
          "Predicted exit value: $312k · 41% recoverable with offer",
        ],
        action: "Route to retention journey · A/B offer test",
      },
    },
    {
      q: "Push the at-risk segment to our CRM",
      ctx: {
        accountId: 'segment · churn-14d',
        tag: '847 players · synced just now',
        kpis: [
          { l: 'Audience', v: '847' },
          { l: 'Predicted save', v: '$128k' },
          { l: 'Channel', v: 'CRM · email' },
          { l: 'Status', v: 'Ready' },
        ],
      },
      reply: {
        title: "Ready to sync · 847 players → CRM",
        bullets: [
          "Mapped to existing audience: Retention · 14-day cooldown",
          "Offer template: 25% match-deposit, 7-day expiry · pre-approved",
          "Will push members to existing CRM audience for retention outreach",
        ],
        action: "Push 847 players to CRM",
        actionKind: 'crm',
      },
    },
  ]

  const [promptIdx, setPromptIdx] = useState(0)
  const [typedQ, setTypedQ] = useState('')
  const [phase, setPhase] = useState<'typing' | 'sending' | 'thinking' | 'answering' | 'settled'>('typing')
  const [crmPhase, setCrmPhase] = useState<'idle' | 'clicking' | 'syncing' | 'done'>('idle')
  const [revealedBullets, setRevealedBullets] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const current = prompts[promptIdx]

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [phase, revealedBullets, crmPhase, promptIdx])

  // Typewriter
  useEffect(() => {
    let cancelled = false
    setTypedQ('')
    setPhase('typing')
    setRevealedBullets(0)
    setCrmPhase('idle')

    const q = current.q
    let i = 0
    const typeTick = setInterval(() => {
      if (cancelled) return
      i += 1
      setTypedQ(q.slice(0, i))
      if (i >= q.length) {
        clearInterval(typeTick)
        setTimeout(() => !cancelled && setPhase('sending'), 450)
      }
    }, 38)

    return () => { cancelled = true; clearInterval(typeTick) }
  }, [promptIdx, current.q])

  // sending -> thinking
  useEffect(() => {
    if (phase !== 'sending') return
    const t = setTimeout(() => setPhase('thinking'), 350)
    return () => clearTimeout(t)
  }, [phase])

  // thinking -> answering
  useEffect(() => {
    if (phase !== 'thinking') return
    const t = setTimeout(() => setPhase('answering'), 700)
    return () => clearTimeout(t)
  }, [phase])

  // answering -> reveal bullets -> settled
  useEffect(() => {
    if (phase !== 'answering') return
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
  }, [phase, current.reply.bullets.length])

  // settled -> auto-advance (with CRM sequence for last prompt)
  useEffect(() => {
    if (phase !== 'settled') return
    const isCrm = current.reply.actionKind === 'crm'
    if (isCrm) {
      const t1 = setTimeout(() => setCrmPhase('clicking'), 800)
      const t2 = setTimeout(() => setCrmPhase('syncing'), 1300)
      const t3 = setTimeout(() => setCrmPhase('done'), 2700)
      const t4 = setTimeout(() => setPromptIdx((promptIdx + 1) % prompts.length), 5400)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    }
    const t = setTimeout(() => setPromptIdx((promptIdx + 1) % prompts.length), 3500)
    return () => clearTimeout(t)
  }, [phase, promptIdx, current.reply.actionKind, prompts.length])

  return (
    <SectionShell padY={96}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 80, alignItems: 'center' }}>
        {/* Left: copy */}
        <div>
          <Eyebrow>Ask in plain language</Eyebrow>
          <SectionTitle max={520}>Your team works the way they think.</SectionTitle>
          <Lede max={520}>Type a question. sensAi reads your data, returns evidence, and offers the next action — no SQL, no analyst tickets, no waiting.</Lede>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { t: 'Plain-language questions', s: 'Risk profiles, segments, anomalies — ask in your own words.' },
              { t: 'Evidence, not just answers', s: 'Every response is grounded in the underlying data and traceable.' },
              { t: 'One click to act', s: 'Push to CRM, open a case, or route a journey from inside the answer.' },
            ].map(it => (
              <div key={it.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: SENS.blueBright, marginTop: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: SENS.ink }}>{it.t}</div>
                  <div style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.5, marginTop: 2 }}>{it.s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt picker dots */}
          <div style={{ marginTop: 36, display: 'flex', gap: 8, alignItems: 'center' }}>
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

        {/* Right: Q Center app chrome mock */}
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
                              background: current.reply.actionKind === 'crm' && crmPhase === 'done' ? '#eaf6ee' : SENS.bgDeeper,
                              border: `1px solid ${current.reply.actionKind === 'crm' && crmPhase === 'done' ? '#9fcdb0' : SENS.rule}`,
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
                                  background: crmPhase === 'done' ? '#1a8245' : '#0a0a0a',
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
                                  background: '#0a0a0a', color: '#fff', border: 'none',
                                  borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer',
                                  letterSpacing: -0.1,
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Apply
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
                  <>
                    {typedQ}
                    <span className="sensai-cursor-blink" style={{ display: 'inline-block', width: 2, height: 14, background: SENS.blueBright, marginLeft: 2 }} />
                  </>
                ) : 'Ask sensAi…'}
              </span>
              <button style={{
                background: phase === 'typing' && typedQ.length > 0 ? '#0a0a0a' : '#dde2ee',
                color: '#fff', border: 'none',
                width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M3 7l4-4 4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 7: USE CASES (5 cards with custom SVG icons)
// ═══════════════════════════════════════════════════════════════════

function UseCaseIcon({ kind }: { kind: string }) {
  const stroke = SENS.blueBright
  const sw = 1.6
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none' as const }
  switch (kind) {
    case 'risk':
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.2-3 7.8-7 9.5-4-1.7-7-5.3-7-9.5V6l7-3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
          <circle cx="12" cy="11" r="2" fill={stroke}/>
        </svg>
      )
    case 'vip':
      return (
        <svg {...common}>
          <path d="M3 8l3 9h12l3-9-5 3-4-6-4 6-5-3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
          <circle cx="12" cy="5" r="1.4" fill={stroke}/>
        </svg>
      )
    case 'segments':
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="2.2" stroke={stroke} strokeWidth={sw}/>
          <circle cx="16" cy="8" r="2.2" stroke={stroke} strokeWidth={sw}/>
          <circle cx="11" cy="16" r="2.2" stroke={stroke} strokeWidth={sw}/>
          <path d="M9 9.5l1.5 5M14 9.5l-1.5 5M9.2 8h5.6" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      )
    case 'kpi':
      return (
        <svg {...common}>
          <path d="M4 19h16" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          <rect x="6" y="13" width="2.6" height="5" stroke={stroke} strokeWidth={sw}/>
          <rect x="11" y="9" width="2.6" height="9" stroke={stroke} strokeWidth={sw}/>
          <rect x="16" y="6" width="2.6" height="12" stroke={stroke} strokeWidth={sw}/>
          <circle cx="17.3" cy="4" r="1.2" fill={stroke}/>
        </svg>
      )
    case 'game':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={sw}/>
          <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth={sw}/>
          <circle cx="12" cy="12" r="1.4" fill={stroke}/>
          <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

function UseCases() {
  const cases = [
    { kind: 'risk', t: 'Risk & Fraud', s: 'Bonus abuse networks, suspicious patterns, coordinated accounts.' },
    { kind: 'vip', t: 'VIP & Player Value', s: 'Hidden VIPs, lifetime value, churn prevention.' },
    { kind: 'segments', t: 'Segmentation', s: 'Behavioral clusters that stay current as players change.' },
    { kind: 'kpi', t: 'KPI Monitoring', s: 'Anomaly detection across your business metrics.' },
    { kind: 'game', t: 'Game Intelligence', s: 'Player–game fit, recommendations, engagement signals.' },
  ]
  return (
    <SectionShell padY={96}>
      <Eyebrow>Use cases</Eyebrow>
      <SectionTitle max={620}>One engine. Multiple use cases.</SectionTitle>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {cases.map(c => (
          <div key={c.t} className="sensai-usecase-card" style={{ background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 14, padding: 22 }}>
            <div className="sensai-usecase-icon" style={{
              width: 36, height: 36, borderRadius: 8, background: SENS.bgDeeper,
              marginBottom: 18, display: 'grid', placeItems: 'center',
            }}>
              <UseCaseIcon kind={c.kind} />
            </div>
            <div className="sensai-usecase-title" style={{ fontSize: 15, fontWeight: 600, color: SENS.ink, marginBottom: 6, letterSpacing: -0.2 }}>{c.t}</div>
            <div style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.5 }}>{c.s}</div>
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
        <div style={{ fontSize: 13, color: SENS.inkSoft, lineHeight: 1.55, overflow: 'hidden' }}>{body}</div>
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
    <SectionShell padY={96} bg={SENS.bgDeeper}>
      <Eyebrow>See it in action</Eyebrow>
      <SectionTitle max={620}>From signal to action in minutes.</SectionTitle>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <WalkthroughCard step="1" title="Signal detected"
          body="sensAi surfaces what needs attention: alerts, risk pockets, queues — all triaged and ready."
          screenshot="/screenshots/daily-digest.png" />
        <WalkthroughCard step="2" title="Network mapped"
          body="Connects accounts and surfaces an organized cluster of related abusers."
          screenshot="/screenshots/raf-network-new.png" />
        <WalkthroughCard step="3" title="Team reviews"
          body="Your team opens the case in Q Center, reviews the 360, and approves the action."
          screenshot="/screenshots/account-360.png" />
        <WalkthroughCard step="4" title="System learns"
          body="The pattern is added to your risk engine and pushed back to your stack — your systems get smarter."
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
    { t: 'Live in production.', s: 'Not a concept. Processing millions of player data points daily in live production.' },
    { t: 'Connected in days, not months.', s: 'Give us access to your raw tables — keep them in your cloud. Your team is using sensAi within two weeks.' },
    { t: 'ROI from week one.', s: 'A 48-hour scan finds bonus abuse rings and under-the-radar VIPs. Everything else is upside.' },
  ]
  return (
    <SectionShell padY={96}>
      <Eyebrow>Why operators choose sensAi</Eyebrow>
      <SectionTitle max={680}>Built for teams who own their customers</SectionTitle>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {cards.map(c => (
          <div key={c.t} style={{ background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 16, padding: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SENS.blueBright, marginBottom: 18 }} />
            <div style={{ fontSize: 17, fontWeight: 600, color: SENS.ink, marginBottom: 8, letterSpacing: -0.3 }}>{c.t}</div>
            <div style={{ fontSize: 14, color: SENS.inkSoft, lineHeight: 1.55 }}>{c.s}</div>
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
    <SectionShell padY={120}>
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <Eyebrow>Early Operator Program</Eyebrow>
        <h2 style={{ margin: 0, fontSize: 56, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.05, color: SENS.ink }}>
          Unlock the full potential of your player data.
        </h2>
        <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.55, color: SENS.inkSoft }}>
          We&apos;re onboarding a small number of operators who want to shape the product with us.
          Favorable terms, direct access to the founding team, and a system built around your workflow.
        </p>

        <div style={{ marginTop: 36, display: 'inline-block' }}>
          <button
            onClick={openBooking}
            style={{
              background: '#fff', border: `1px solid ${SENS.rule}`, borderRadius: 18, padding: '18px 24px',
              display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
              boxShadow: '0 16px 36px -20px rgba(15,28,70,0.2)',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: SENS.bgDeeper, display: 'grid', placeItems: 'center', color: SENS.blueBright }}>
              <Calendar className="w-5 h-5" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: SENS.ink }}>Book a Demo</div>
              <div style={{ fontSize: 13, color: SENS.inkSoft }}>30-minute call with the founding team</div>
            </div>
            <ArrowRight className="w-5 h-5 ml-4" style={{ color: SENS.blueBright }} />
          </button>
        </div>
      </div>
    </SectionShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 11: FOOTER
// ═══════════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${SENS.rule}`, padding: '32px 80px' }}>
      <div className="max-w-[1280px] mx-auto flex justify-between items-center">
        <Logo className="text-xl font-semibold text-foreground" showMascot />
        <div style={{ fontSize: 13, color: SENS.inkSoft }}>Early Operator Program &middot; Limited spots</div>
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
    { stat: '100s', label: 'AI sensors running daily' },
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
    { name: 'Maor Grinberg', role: 'CTO', bio: 'PhD in Complex Systems. Deep expertise in ML and data engineering.' },
  ]
  return (
    <SectionShell padY={96}>
      <Eyebrow>Who&rsquo;s building this</Eyebrow>
      <SectionTitle max={620}>Operators and engineers, not just AI people.</SectionTitle>

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

export function SensAiOnePager() {
  return (
    <div className="sensai-page" style={{ background: SENS.bg, color: SENS.ink, width: '100%', minHeight: '100vh' }}>
      {/*
        ─── PARKED SECTIONS (defined above, currently NOT rendered) ───
        <SocialProof />  — "Live · 400K+ accounts · 100s sensors" strip.
                           Removed because we don't want to advertise these
                           specific numbers publicly yet.
        <Founders />     — Amit + Maor founder cards.
                           Removed for now; may bring back closer to launch.
        Re-enable by dropping <SocialProof /> and/or <Founders /> back into
        the section list below.
      */}
      <Nav />
      <Hero />
      <GapSection />
      <WhatItDoesSection />
      <HowItWorks />
      <AskSensAi />
      <UseCases />
      <Walkthrough />
      <Why />
      <CTA />
      <Footer />
    </div>
  )
}
