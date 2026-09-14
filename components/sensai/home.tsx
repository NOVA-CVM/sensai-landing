"use client"

// getsensai.co — the home page.
// Every line here derives from sales/sensai-offer-source-of-truth.md (v5.3). Section numbers in
// comments refer to that document. Copy changes go there first, then here — never the reverse.
// Rules carried from it: no client names, no calendar dates, no cadence ("every day"), no AI /
// agent vocabulary, "your team" never "your analyst", the scan only as a quiet close, no dollar or
// findings claims around it, RG framing (behaviour and preference signals, never deposit-amount triggers).

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Play } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { VisitTracking } from "@/components/sensai/visit-tracking"
import { HeroResolutionField, IntegrationDiagram, Logo, useInView, useReducedMotion } from "@/components/sensai/one-pager-v2"
import "./home.css"

const C = {
  ink: '#0b1530',
  inkSoft: '#475069',
  blueBright: '#1a44a8',
  rule: '#dfe4ee',
  muted: '#7a849c',
  paper: '#f6f7fa',
  paperDeep: '#eef1f8',
  ok: '#3a8a5a',
  danger: '#b8345a',
} as const

const goBook = (where: string) => {
  trackEvent('cta_click', { cta: 'book_walkthrough', where })
  window.location.href = '/book'
}
const goApply = (where: string) => {
  trackEvent('cta_click', { cta: 'apply_partnership', where })
  window.location.href = '/apply'
}

// ─── small pieces ───────────────────────────────────────────────────

function PrimaryButton({ children, onClick, dark = false }: { children: React.ReactNode; onClick: () => void; dark?: boolean }) {
  return (
    <button onClick={onClick} className="sh-btn" style={{
      background: dark ? C.ink : '#fff', color: dark ? '#fff' : C.ink, border: 'none',
      padding: '15px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      boxShadow: dark ? '0 18px 44px -16px rgba(11,21,48,0.45)' : '0 18px 44px -14px rgba(0,0,0,0.5)',
    }}>{children}</button>
  )
}

function GhostButton({ children, onClick, onDark = true }: { children: React.ReactNode; onClick: () => void; onDark?: boolean }) {
  return (
    <button onClick={onClick} className="sh-btn" style={{
      background: 'transparent', color: onDark ? '#dfe7f8' : C.ink,
      border: `1.5px solid ${onDark ? 'rgba(255,255,255,0.35)' : 'rgba(11,21,48,0.28)'}`,
      padding: '14px 26px', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  )
}

function Eyebrow({ children, tone = 'dark' }: { children: React.ReactNode; tone?: 'dark' | 'light' }) {
  const col = tone === 'dark' ? C.blueBright : '#8fa8e0'
  return (
    <div style={{
      color: col, fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 22, height: 1.5, background: col }} />{children}
    </div>
  )
}

function Title({ children, max = 720, tone = 'dark' }: { children: React.ReactNode; max?: number; tone?: 'dark' | 'light' }) {
  return (
    <h2 style={{
      margin: 0, fontSize: 42, fontWeight: 600, letterSpacing: -1, lineHeight: 1.1,
      color: tone === 'dark' ? C.ink : '#fff', maxWidth: max,
    }}>{children}</h2>
  )
}

function Lede({ children, max = 680, tone = 'dark' }: { children: React.ReactNode; max?: number; tone?: 'dark' | 'light' }) {
  return (
    <p style={{ margin: '18px 0 0', fontSize: 17.5, lineHeight: 1.6, color: tone === 'dark' ? C.inkSoft : '#b6c1dd', maxWidth: max }}>
      {children}
    </p>
  )
}

function Section({ children, bg = '#fff', padY = 96, id, border }: {
  children: React.ReactNode; bg?: string; padY?: number; id?: string; border?: boolean
}) {
  return (
    <section id={id} className="sh-section" style={{ padding: `${padY}px 80px`, background: bg, borderTop: border ? `1px solid ${C.rule}` : undefined }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

// ─── nav ────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sh-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(9, 17, 38, 0.78)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>
          <Logo className="text-xl md:text-2xl font-semibold text-white" showMascot />
        </a>
        <button onClick={() => goBook('nav')} className="sh-btn" style={{
          background: '#fff', color: C.ink, border: 'none', padding: '10px 18px', borderRadius: 999,
          fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          Book a walkthrough <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}

// ─── the film (§1 slogan close sits next to it) ──────────────────────

function Film() {
  // Wide film on desktop, the 4:5 cut on phones. One plays at a time; the poster is a real frame.
  const wideRef = useRef<HTMLVideoElement | null>(null)
  const tallRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  // Both cuts are in the markup so CSS can pick one without a layout shift, but only the cut that
  // is actually shown gets a `src` — otherwise a phone range-fetches the 16:9 film it will never
  // play. Posters render without a src, so the frame is there before this resolves.
  const [cut, setCut] = useState<'wide' | 'tall' | null>(null)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const pick = () => setCut(mq.matches ? 'tall' : 'wide')
    pick()
    mq.addEventListener('change', pick)
    return () => mq.removeEventListener('change', pick)
  }, [])
  const start = (which: 'wide' | 'tall') => {
    const v = which === 'wide' ? wideRef.current : tallRef.current
    if (!v) return
    trackEvent('film_play', { where: 'hero', cut: which })
    v.play().then(() => setPlaying(true)).catch(() => {})
  }
  useEffect(() => {
    const onEnd = () => setPlaying(false)
    wideRef.current?.addEventListener('ended', onEnd)
    tallRef.current?.addEventListener('ended', onEnd)
    return () => {
      wideRef.current?.removeEventListener('ended', onEnd)
      tallRef.current?.removeEventListener('ended', onEnd)
    }
  }, [])
  const overlay = (which: 'wide' | 'tall') => (
    <button aria-label="Play the film" onClick={() => start(which)} style={{
      position: 'absolute', inset: 0, background: 'rgba(11,21,48,0.28)', border: 'none', cursor: 'pointer',
      display: playing ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%',
    }}>
      <span style={{
        width: 84, height: 84, borderRadius: '50%', background: '#fff', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 22px 60px -18px rgba(0,0,0,0.7)',
      }}>
        <Play className="w-8 h-8" style={{ color: C.ink, marginLeft: 4 }} fill={C.ink} />
      </span>
    </button>
  )
  return (
    <div className="sh-film" style={{ position: 'relative' }}>
      <div className="sh-film-wide" style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#0f1420',
        boxShadow: '0 40px 100px -30px rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <video ref={wideRef} src={cut === 'wide' ? '/film/sensai-product-story.mp4' : undefined} poster="/film/poster-wide.jpg" controls={playing}
          playsInline preload="metadata" style={{ width: '100%', display: 'block', aspectRatio: '16 / 9' }} />
        {overlay('wide')}
      </div>
      <div className="sh-film-tall" style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#0f1420',
        boxShadow: '0 40px 100px -30px rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <video ref={tallRef} src={cut === 'tall' ? '/film/sensai-45.mp4' : undefined} poster="/film/poster-45.jpg" controls={playing}
          playsInline preload="metadata" style={{ width: '100%', display: 'block', aspectRatio: '4 / 5' }} />
        {overlay('tall')}
      </div>
    </div>
  )
}

// ─── hero (§1) ───────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="sh-hero sh-section" style={{ background: C.ink, padding: '150px 80px 96px', position: 'relative', overflow: 'hidden' }}>
      {/* Same hero ground as /sense: the resolution field (blurred crowd resolving to crisp players) under a scrim. Keep. */}
      <div aria-hidden className="sensai-hero-field" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <HeroResolutionField />
      </div>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(11,21,48,0.96) 0%, rgba(11,21,48,0.78) 50%, rgba(11,21,48,0.35) 100%)',
      }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ color: '#7d89a8', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', marginBottom: 22 }}>
            FOR GAMING OPERATORS · THE TEAMS THAT OWN CUSTOMER REVENUE
          </div>
          <h1 style={{ margin: 0, fontSize: 58, lineHeight: 1.08, letterSpacing: -1.8, fontWeight: 600, color: '#fff' }}>
            Sensai finds <span style={{ color: '#8fa8e0' }}>the leaks</span> in your customer base. You keep the revenue.
          </h1>
          {/* §1 — the slogan close (site, deck cover, film). Never both closes in one artifact. */}
          <p className="sh-hero-p" style={{ margin: '26px auto 0', fontSize: 17.5, lineHeight: 1.62, color: '#b6c1dd', maxWidth: 760 }}>
            Even the best operators leak revenue they&rsquo;ve already paid for — to bonuses taken by fraud
            rings and wasted on players who didn&rsquo;t need them, to VIPs who quietly churn without anyone
            reading their signals, to customers who drop after a failed deposit that nobody picked up.
            Catching it takes a precise, always-on reading of every customer — something no operator could
            do until now.
          </p>
          <p className="sh-hero-p" style={{ margin: '14px auto 0', fontSize: 17.5, lineHeight: 1.62, color: '#fff', maxWidth: 760, fontWeight: 500 }}>
            Sensai does: every customer watched, every change caught, every finding pushed into the
            systems your teams already use.
          </p>
          <div className="sh-ctas" style={{ marginTop: 34, display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <PrimaryButton onClick={() => goBook('hero')}>Book a walkthrough <ArrowRight className="w-4 h-4" /></PrimaryButton>
            <GhostButton onClick={() => { trackEvent('cta_click', { cta: 'how_it_works', where: 'hero' }); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}>
              How it works
            </GhostButton>
          </div>
        </div>
        <div style={{ marginTop: 64, maxWidth: 1080, marginLeft: 'auto', marginRight: 'auto' }}>
          <Film />
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12.5, color: '#7d89a8', letterSpacing: '0.04em' }}>
            The product, shown inside the assistant your team already uses. Values transformed, accounts masked.
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── §3 the problem, in their words ─────────────────────────────────

function Problem() {
  return (
    <Section bg={C.paper} padY={88}>
      <div className="sh-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'start' }}>
        <div>
          <Eyebrow>The problem</Eyebrow>
          <Title max={480}>One customer. Five teams. Nobody sees the whole.</Title>
          <Lede max={460}>
            CRM owns the emails. Risk owns the fraud checks. VIP owns the top one percent. Product owns the lobby.
            Each can act on its own angle of the customer — none can see all of it, and nobody&rsquo;s job is to.
          </Lede>
        </div>
        <blockquote style={{
          margin: 0, background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 18, padding: '30px 34px',
          fontSize: 19, lineHeight: 1.6, color: C.ink, fontStyle: 'italic', position: 'relative',
        }}>
          <span aria-hidden style={{ position: 'absolute', top: 14, left: 22, fontSize: 64, lineHeight: 1, color: '#c9d3ea', fontStyle: 'normal' }}>&ldquo;</span>
          I know we&rsquo;re not making the most of the base, and I don&rsquo;t have a clear picture. Analytics is a
          bottleneck. Every angle of the customer sits with a different team. Compliance closes accounts without
          asking me. Fraud doesn&rsquo;t cover bonus abuse, so I lose money to abusers. VIPs go quietly. Payments fixed
          the deposit error — but who&rsquo;s acting on the customers it hit?
          <div style={{ marginTop: 16, fontSize: 12.5, fontStyle: 'normal', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            What we hear from the people who own the revenue line
          </div>
        </blockquote>
      </div>
    </Section>
  )
}

// ─── §4a the leaks we stop ──────────────────────────────────────────

const LEAKS = [
  { n: '01', t: 'Fraud rings take your bonuses', s: 'Rings, syndicates, multi-accounting — taking promotional money consistently, from a budget that runs 10–20% of your revenue.' },
  { n: '02', t: 'VIPs quietly churn', s: 'The signals are in the play, weeks before the revenue moves. Caught on behaviour, while there is still someone to keep.' },
  { n: '03', t: 'Valuable players identified too late', s: 'Tomorrow&rsquo;s VIPs, flagged in their first weeks — while nurturing still changes the outcome.' },
  { n: '04', t: 'Customers drop after product failures', s: 'A failed deposit, a payment error, a disconnection. The error gets fixed; the customers it hit don&rsquo;t get actioned.' },
  { n: '05', t: 'Wrong offers to the wrong players', s: 'Over-bonused players who would have played anyway, under-bonused players who were worth keeping — the same budget, leaking both ways.' },
  { n: '06', t: 'Accounts closed or restricted without you knowing', s: 'Over-closure — fraud shutting too many accounts, or adding too much friction — lands on your revenue line, not theirs.' },
]

function Leaks() {
  return (
    <Section id="leaks" padY={96}>
      <Eyebrow>The leaks we stop</Eyebrow>
      <Title max={640}>Retention is the outcome. These are the leaks that drain it.</Title>
      <Lede max={640}>
        Every one of them lands on the revenue line, and no other team owns the detection. Abuse is where we
        start, because that is where the money is most visible. The offer is the whole line.
      </Lede>
      <div className="sh-grid-3" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {LEAKS.map(l => (
          <div key={l.n} style={{ background: C.paper, border: `1px solid ${C.rule}`, borderRadius: 16, padding: '26px 26px 28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, color: C.danger, letterSpacing: '0.12em', marginBottom: 14 }}>LEAK {l.n}</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: C.ink, letterSpacing: -0.3, lineHeight: 1.25 }}>{l.t}</div>
            <div style={{ marginTop: 10, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: l.s }} />
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── §5 how it works ────────────────────────────────────────────────

const HOW = [
  { t: 'Every customer generates a revenue stream.', s: 'Its past, its present, and where it should be heading. That is how we decompose your revenue through the customer lens — a leak is a stream that has dropped below where it should be.' },
  { t: 'Read-only. History included.', s: 'We connect to your data as it is — pseudonymised behavioural data, no PII — and read the whole history, not a sample.' },
  { t: 'Every account, in depth, watched for change.', s: 'The money, the play, the timing, its relations to other accounts. Changes and anomalies are read against known patterns; the patterns adapt to your business, and keep learning from what your team confirms.' },
  { t: 'When something breaks, it walks down to the reason — and to the accounts.', s: 'Not a score. The accounts, the pattern, the evidence. The numbers are computed, not generated: the assistant explains a finding, it never invents one.' },
  { t: 'Pushed where your team already works.', s: 'A list in the CRM, a ticket in the risk queue, a case for the VIP team. It doesn&rsquo;t talk to your players — it works through your teams&rsquo; systems.' },
  { t: 'Your team stays in control.', s: 'Nothing is armed without your confirmation; what you confirm becomes the next pattern.' },
]

function How() {
  const { ref, inView } = useInView()
  const reduced = useReducedMotion()
  return (
    <Section id="how-it-works" bg={C.paperDeep} padY={100} border>
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Eyebrow>How it works</Eyebrow></div>
        <Title max={760}>Read access in. Actions out.</Title>
        <Lede max={620}>
          Sensai sits between the data you already have and the systems your teams already run. Nothing new to
          learn, no new channel — and no one on your side watching a screen.
        </Lede>
      </div>
      <div ref={ref} className="sh-diagram" style={{ marginTop: 56, maxWidth: 1080, marginLeft: 'auto', marginRight: 'auto', background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 20, padding: '28px 20px 16px' }}>
        <div className="sh-diagram-scroll"><div className="sh-diagram-inner">
          <IntegrationDiagram animate={inView && !reduced} outputs={['CRM', 'Case manager', 'Risk tools', 'BI', 'Other']} nodeCaption="WATCHING EVERY CUSTOMER" />
        </div></div>
      </div>
      {/* Gabi's review, approved by AA — where it runs, then what it is allowed to touch. */}
      <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, lineHeight: 1.6, color: C.muted, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        Works inside the assistant your team already uses &mdash; Claude, ChatGPT &mdash; through a standard connector (MCP).
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {['Read-only access', 'Pseudonymised data', 'No PII'].map(chip => (
          <span key={chip} style={{
            border: `1px solid ${C.rule}`, background: '#fff', borderRadius: 999,
            padding: '7px 14px', fontSize: 13, color: C.inkSoft,
          }}>{chip}</span>
        ))}
      </div>
      <div className="sh-grid-3" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {HOW.map(h => (
          <div key={h.t} style={{ background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 16, padding: '24px 24px 26px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.blueBright, marginTop: 9, flexShrink: 0 }} />
              <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, letterSpacing: -0.2, lineHeight: 1.3 }}>{h.t}</div>
            </div>
            <div style={{ marginTop: 8, paddingLeft: 20, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: h.s }} />
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── §6 how you know it's working ───────────────────────────────────

function Measure() {
  const items = [
    { t: 'Your numbers, not ours.', s: 'Revenue first; then retention, churn, bonus cost — the figures you already report.' },
    { t: 'On your side, in your tables.', s: 'We bring the flagged accounts and what was done. You see what happened.' },
    { t: 'The method fits you.', s: 'Damage avoided on the accounts we flagged, matched groups, or a hold-out where you want one. Agreed together in the first weeks, never imposed.' },
    { t: 'Minimal effort on yours.', s: 'Setting up the count is our work. Yours is to look at it.' },
  ]
  return (
    <Section bg={C.ink} padY={100}>
      <div className="sh-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'start' }}>
        <div>
          <Eyebrow tone="light">How you know it&rsquo;s working</Eyebrow>
          <Title tone="light" max={460}>We attach to your KPIs, not ours.</Title>
          <Lede tone="light" max={440}>
            Measured on the numbers you already report, on your side, in your tables — and set up together in the
            first weeks, so the count is one you own.
          </Lede>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="sh-grid-2-inner">
          {items.map(i => (
            <div key={i.t} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '22px 22px 24px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: -0.2 }}>{i.t}</div>
              <div style={{ marginTop: 8, fontSize: 14.5, color: '#b6c1dd', lineHeight: 1.55 }}>{i.s}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── §7 proof — counts and rates only, no names, no dates ───────────

function Proof() {
  const tiles = [
    { v: '10 months', l: 'live in production with a tier-1 operator, on a base of ~2.5M accounts.' },
    { v: '58%', l: 'of the accounts we flagged were later listed by the operator&rsquo;s own review — median three days after our flag.' },
    { v: 'Their automation', l: 'now runs on our lists: the operator asked for a dedicated table so his own process could consume them.' },
  ]
  return (
    <Section padY={96}>
      <Eyebrow>In production</Eyebrow>
      <Title max={640}>Running today, measured on the operator&rsquo;s own numbers.</Title>
      <div className="sh-grid-3" style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {tiles.map(t => (
          <div key={t.v} style={{ background: C.paper, border: `1px solid ${C.rule}`, borderRadius: 16, padding: '26px 26px 28px' }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: C.ink, letterSpacing: -1, lineHeight: 1.05 }}>{t.v}</div>
            <div style={{ marginTop: 10, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: t.l }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 720 }}>
        Counts and rates only, from one deployment. We don&rsquo;t publish client names, and we don&rsquo;t publish a
        money figure until the causal cut has survived on the operator&rsquo;s side.
      </div>
    </Section>
  )
}

// ─── §9 what we are not ─────────────────────────────────────────────

function Not() {
  const items = [
    { t: 'Not personalisation.', s: 'Personalisation changes what the player sees. Sensai changes what your teams do about the player.' },
    { t: 'Not a one-size platform.', s: 'No generic models that fit the average operator on day one and drift behind your business by month three. Fitted to your promotions, games, markets and abuse patterns — and a change ships in days, not through a data-science ticket.' },
    { t: 'Not a risk tool.', s: 'Bonus abuse lands on the revenue line. We work for the people who own it.' },
    { t: 'Not a chatbot.', s: 'It doesn&rsquo;t talk to your players. It works through your teams&rsquo; systems.' },
    { t: 'Not a replacement for your engagement tools.', s: 'Already have VIP hosts or an engagement platform? Sensai is the engine behind them: context, evidence, next actions.' },
    { t: 'Not acquisition.', s: 'Existing customers only. We never touch acquisition offers.' },
  ]
  return (
    <Section bg={C.paper} padY={92} border>
      <Eyebrow>What Sensai is not</Eyebrow>
      <Title max={560}>Easier to place once you know what it isn&rsquo;t.</Title>
      <div className="sh-grid-3" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {items.map(i => (
          <div key={i.t} style={{ padding: '4px 0' }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, letterSpacing: -0.2 }}>{i.t}</div>
            <div style={{ marginTop: 6, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: i.s }} />
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── founders ───────────────────────────────────────────────────────

function Founders() {
  const team = [
    { name: 'Amit Assa', role: 'CEO', bio: '17 years running CRM, VIP and retention on the operator side of online gaming and digital platforms.' },
    { name: 'Gabi Dvir', role: 'Co-founder', bio: '20+ years in tech leadership. Ex-VP DevOps at 888 and Fiverr.' },
  ]
  return (
    <Section padY={88}>
      <div className="sh-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'start' }}>
        <div>
          <Eyebrow>Who&rsquo;s building this</Eyebrow>
          <Title max={440}>Built by people who ran these teams.</Title>
          <Lede max={420}>The playbooks, the abuse patterns and the churn signals come from years on the operator side — not learned from scratch on your data.</Lede>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="sh-grid-2-inner">
          {team.map(t => (
            <div key={t.name} style={{ background: C.paper, border: `1px solid ${C.rule}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.ink, letterSpacing: -0.3 }}>{t.name}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: C.blueBright, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.role}</div>
              <div style={{ marginTop: 10, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.55 }}>{t.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── §8 how to start ────────────────────────────────────────────────

function Start() {
  return (
    <section className="sh-section" style={{ padding: '110px 80px', background: C.ink, position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div aria-hidden style={{
        position: 'absolute', width: 640, height: 640, borderRadius: '50%', top: -260, left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(26,68,168,0.35) 0%, rgba(26,68,168,0) 70%)', pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ color: '#8fa8e0', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>How to start</div>
        <h2 style={{ margin: 0, fontSize: 50, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.08, color: '#fff' }}>
          Design partnerships, open for a small number of operators.
        </h2>
        <p style={{ margin: '20px auto 0', fontSize: 17, lineHeight: 1.6, color: '#b6c1dd', maxWidth: 640 }}>
          Read access, scripts approved by you, live within weeks. The first leak lands in your CRM with the
          accounts — and a measure you own. Partners work directly with the founders, shape what gets built
          next, and lock early terms.
        </p>
        <div className="sh-ctas" style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryButton onClick={() => goBook('start')}>Book a walkthrough <ArrowRight className="w-4 h-4" /></PrimaryButton>
          <GhostButton onClick={() => goApply('start')}>Apply for a partnership</GhostButton>
        </div>
        {/* §8 — the scan may close an owned page: no dollar claims, no findings claims, no magnet language. */}
        <div style={{
          marginTop: 56, paddingTop: 26, borderTop: '1px solid rgba(255,255,255,0.12)',
          fontSize: 14, lineHeight: 1.7, color: '#9aa6c4', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Need to see it on your own data before anything else? One extract, 48 hours, no integration — a read
          of your base, less tuned than a live deployment, and we say so. Ask for it on the call.
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="sh-section" style={{ borderTop: `1px solid ${C.rule}`, padding: '16px 80px', background: '#fff' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 34, flexWrap: 'wrap', gap: 10 }}>
        <Logo className="text-base font-semibold" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: C.inkSoft }}>Finds the leaks in your customer base. You keep the revenue.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: C.inkSoft }}>
            <span className="sensai-heartbeat" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4f8a68', display: 'inline-block' }} />
            Live in production.
          </span>
        </div>
      </div>
    </footer>
  )
}

export function SensaiHome() {
  return (
    <div className="sensai-home" style={{ background: '#fff', color: C.ink, width: '100%', minHeight: '100vh' }}>
      <VisitTracking page="home" />
      <Nav />
      <Hero />
      <Problem />
      <Leaks />
      <How />
      <Measure />
      <Proof />
      <Not />
      <Founders />
      <Start />
      <Footer />
    </div>
  )
}
