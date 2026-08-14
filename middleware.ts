import { NextResponse, type NextRequest } from 'next/server'

// Analytics caught a real visitor landing on `/%20sense` — a link pasted with a leading space,
// which WhatsApp and mail clients do routinely. That was a 404 for someone we had sent the page to.
// Anything that cleans up to a route we actually serve gets redirected there, query string intact.
// Deliberately narrow: only known routes are rescued, so no legitimate path can be rewritten.
const KNOWN_ROUTES = new Set(['/', '/sense', '/book', '/apply', '/v2', '/chat'])

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

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
