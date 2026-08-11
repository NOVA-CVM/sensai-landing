"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

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
    <a href="/v2" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <img src="/sensai-mascot.png" alt="sensAi" style={{ width: 40, height: 40, borderRadius: 10 }} />
      <span style={{
        fontWeight: 600, fontSize: 22, letterSpacing: '0.08em', color: '#fff',
      }}>sens<span style={{ fontSize: '1.15em', fontWeight: 700 }}>A</span>i</span>
    </a>
  )
}

export function BookPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // No backend yet: forward to the walkthrough calendar (database hookup later).
    setSubmitted(true)
    window.location.href = BOOKING_URL
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: SENS.ink }}>
      <nav style={{ background: SENS.ink, padding: '16px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Logo />
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 40px 96px' }}>
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
                Get an expert on every player.
              </h1>
              <p style={{ margin: '14px 0 10px', fontSize: 16, lineHeight: 1.55, color: SENS.inkSoft }}>
                Tell us a little about your operation. We take it from there.
              </p>

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
                  {submitted ? 'Opening the calendar…' : 'Book a walkthrough'} <ArrowRight className="w-4 h-4" />
                </button>
                <div style={{ fontSize: 12, color: SENS.muted }}>
                  By submitting you agree to our Privacy Policy
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
