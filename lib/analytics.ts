import { track } from '@vercel/analytics'

// Round 10, items 2+3 — cookieless visit tracking.
//
// Links go out as www.novacvm.net/sense?r=7412: an opaque 4-digit serial with no recipient
// name in the URL. The mapping code -> recipient lives with us in marketing/link-registry.md.
// The code never renders and never changes the page; it only rides along on analytics events
// so we can see which code hit, when, and how far it scrolled.
//
// Storage note: sessionStorage, not a cookie — the "no cookies, therefore no consent banner"
// requirement is hard. sessionStorage is first-party, per-tab, and cleared on tab close.

const REF_KEY = 'sensai_r'

/** The visit's serial code, if this visit arrived with one (or already carries one this session). */
export function refCode(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('r')
    if (fromUrl && /^\d{4}$/.test(fromUrl)) {
      window.sessionStorage.setItem(REF_KEY, fromUrl)
      return fromUrl
    }
    return window.sessionStorage.getItem(REF_KEY)
  } catch {
    return null
  }
}

/** Fire a custom event with the serial code attached, if there is one. Never throws. */
export function trackEvent(name: string, props: Record<string, string | number | boolean> = {}) {
  try {
    const r = refCode()
    track(name, r ? { ...props, r } : props)
  } catch {
    /* analytics must never break the page */
  }
}
