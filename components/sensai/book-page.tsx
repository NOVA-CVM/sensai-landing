"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { VisitTracking } from "@/components/sensai/visit-tracking"

const SENS = {
  bg: '#eef1f8',
  ink: '#0b1530',
  inkSoft: '#475069',
  blue: '#0c2c63',
  blueBright: '#1a44a8',
  rule: '#dfe4ee',
  muted: '#7a849c',
} as const

const BOOKING_URL = "https://calendar.app.google/K15ZBdA3E6WBxbWXA"

// Round 10, item 4 — nothing may be lost.
// Submissions POST to a hosted form endpoint (Web3Forms: instant email to AA, submissions kept
// in the provider dashboard, no account needed to get a key). The key is an env var so it can be
// rotated without a code change: set NEXT_PUBLIC_WEB3FORMS_KEY in the Vercel project.
// Until the key is set, the form keeps its previous behaviour (straight to the calendar) so the
// page never regresses — see the memo for the one step AA has to do.
const FORM_ENDPOINT = "https://api.web3forms.com/submit"
const FORM_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: `1px solid ${SENS.rule}`, background: '#fff',
  fontSize: 14, color: SENS.ink, outline: 'none',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: SENS.ink,
  marginBottom: 6, marginTop: 18,
}

function Logo() {
  return (
    <a href="/sense" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <img src="/sensai-mascot.png" alt="sensAi" style={{ width: 40, height: 40, borderRadius: 10 }} />
      <span style={{
        fontWeight: 600, fontSize: 22, letterSpacing: '0.08em', color: '#fff',
      }}>sens<span style={{ fontSize: '1.15em', fontWeight: 700 }}>A</span>i</span>
    </a>
  )
}

export function BookPage({ program = false }: { program?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)
  const source = program ? 'design-partnership' : 'walkthrough'

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    // Honeypot: bots fill every field they find. No captcha — friction costs us leads.
    const data = new FormData(form)
    if ((data.get('botcheck') as string | null)?.length) return

    setSubmitted(true)
    setFailed(false)

    if (!FORM_KEY) {
      // Endpoint not configured yet: previous behaviour, straight to the calendar.
      window.location.href = program ? `${BOOKING_URL}?src=design-partnership` : BOOKING_URL
      return
    }

    data.set('access_key', FORM_KEY)
    data.set('subject', program
      ? 'sensAi — design partnership application'
      : 'sensAi — walkthrough request')
    data.set('from_name', 'novacvm.net')

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(`form endpoint returned ${res.status}`)
      trackEvent('form_submit', { source })
      setDone(true)
    } catch {
      // Never swallow a lead: fall back to the calendar so the person still lands somewhere useful.
      trackEvent('form_submit_failed', { source })
      setFailed(true)
      setSubmitted(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: '#ffffff', minHeight: '100vh', color: SENS.ink }}>
        <VisitTracking page={program ? 'apply' : 'book'} />
        <nav style={{ background: SENS.ink, padding: '16px 40px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto' }}><Logo /></div>
        </nav>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 40px 120px' }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: -1, lineHeight: 1.14 }}>
            {program ? 'Your application is in.' : 'Got it.'}
          </h1>
          <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.6, color: SENS.inkSoft }}>
            {program
              ? 'We read every application ourselves. You will hear back from one of the founders.'
              : 'We will come back to you shortly.'}
            {' '}If you would rather not wait, pick a slot now.
          </p>
          <a
            href={program ? `${BOOKING_URL}?src=design-partnership` : BOOKING_URL}
            onClick={() => trackEvent('cta_click', { cta: 'calendar_after_submit', where: source })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28,
              background: SENS.blue, color: '#fff', textDecoration: 'none',
              padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 500,
              boxShadow: '0 14px 34px -12px rgba(12,44,99,0.5)',
            }}
          >
            Pick a walkthrough slot <ArrowRight className="w-4 h-4" />
          </a>
        </main>
      </div>
    )
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: SENS.ink }}>
      <VisitTracking page={program ? 'apply' : 'book'} />
      <nav style={{ background: SENS.ink, padding: '16px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Logo />
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 40px 96px' }}>
        <a href="/sense" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          fontSize: 13.5, fontWeight: 500, color: SENS.muted, marginBottom: 40,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </a>
        <form onSubmit={onSubmit}>
          <div className="sensai-book-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start',
          }}>
            {/* Left: headline + identity fields */}
            <div>
              <h1 style={{
                margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: -1,
                lineHeight: 1.12, color: SENS.ink,
              }}>
                {program ? 'Apply to the design partnership.' : 'Get an expert on every player.'}
              </h1>
              <p style={{ margin: '14px 0 10px', fontSize: 16, lineHeight: 1.55, color: SENS.inkSoft }}>
                Tell us a little about your operation. We take it from there.
              </p>

              {/* Which CTA this came from — partnership applications must stay distinguishable */}
              <input type="hidden" name="type" value={source} />
              <input type="hidden" name="source" value={source} />
              {/* Honeypot: hidden from people, irresistible to bots. No captcha. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: 'none' }}
              />
              <label style={labelStyle} htmlFor="bk-name">Full name*</label>
              <input id="bk-name" name="name" required style={inputStyle} autoComplete="name" />

              <label style={labelStyle} htmlFor="bk-email">Email*</label>
              <input id="bk-email" name="email" type="email" required style={inputStyle} autoComplete="email" />

              <label style={labelStyle} htmlFor="bk-company">Company*</label>
              <input id="bk-company" name="company" required style={inputStyle} autoComplete="organization" />

              <label style={labelStyle} htmlFor="bk-title">Job title*</label>
              <input id="bk-title" name="title" required style={inputStyle} autoComplete="organization-title" />
            </div>

            {/* Right: context fields + submit */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <label style={{ ...labelStyle, marginTop: 0 }} htmlFor="bk-size">Company size*</label>
              <select id="bk-size" name="size" required defaultValue="" style={{ ...inputStyle, appearance: 'auto' }}>
                <option value="" disabled>Select</option>
                <option>1–50</option>
                <option>51–200</option>
                <option>201–1,000</option>
                <option>1,000+</option>
              </select>

              <label style={labelStyle} htmlFor="bk-solve">What are you looking to solve?</label>
              <textarea id="bk-solve" name="solve" rows={9} style={{ ...inputStyle, resize: 'vertical', minHeight: 180 }} />

              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <button type="submit" disabled={submitted} style={{
                  background: SENS.blue, color: '#fff', border: 'none',
                  padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 500,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 14px 34px -12px rgba(12,44,99,0.5)',
                  opacity: submitted ? 0.7 : 1,
                }}>
                  {submitted ? 'Sending…' : program ? 'Apply to the program' : 'Book a walkthrough'} <ArrowRight className="w-4 h-4" />
                </button>
                <div style={{ fontSize: 12, color: SENS.muted, textAlign: 'right' }}>
                  We&rsquo;ll use your details only to reply to your enquiry.
                </div>
                {failed && (
                  <div style={{ fontSize: 12.5, color: '#b03a3a', textAlign: 'right', maxWidth: 320 }}>
                    That didn&rsquo;t send. Please try once more, or pick a slot directly:{' '}
                    <a href={BOOKING_URL} style={{ color: SENS.blueBright }}>the calendar</a>.
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
