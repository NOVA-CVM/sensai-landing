import { NextResponse, type NextRequest } from 'next/server'

// Analytics caught a real visitor landing on `/%20sense` — a link pasted with a leading space,
// which WhatsApp and mail clients do routinely. That was a 404 for someone we had sent the page to.
// Anything that cleans up to a route we actually serve gets redirected there, query string intact.
// Deliberately narrow: only known routes are rescued, so no legitimate path can be rewritten.
const KNOWN_ROUTES = new Set(['/', '/sense', '/book', '/apply', '/v2', '/chat'])

// novacvm.net keeps the page it has always served; getsensai.co is the repositioned site.
// Both domains are one Vercel project, so the split happens here, on the Host header.
// A rewrite, not a redirect: the URL stays novacvm.net/ and nobody is bounced to another domain.
const LEGACY_HOSTS = new Set(['novacvm.net', 'www.novacvm.net'])

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase()
  if (pathname === '/' && LEGACY_HOSTS.has(host)) {
    const legacy = req.nextUrl.clone()
    legacy.pathname = '/legacy'
    return NextResponse.rewrite(legacy)
  }

  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return NextResponse.next()
  }

  const cleaned = decoded.replace(/\s+/g, '').toLowerCase()
  if (cleaned === decoded || !KNOWN_ROUTES.has(cleaned)) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = cleaned
  url.search = search
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Only paths containing an encoded space can match; everything else skips the middleware entirely.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
