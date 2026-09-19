import { NextResponse, type NextRequest } from 'next/server'

// Analytics caught a real visitor landing on `/%20sense`: a link pasted with a leading space,
// which WhatsApp and mail clients do routinely. That was a 404 for someone we had sent the page to.
// Anything that cleans up to a route we actually serve gets redirected there, query string intact.
// Deliberately narrow: only known routes are rescued, so no legitimate path can be rewritten.
const KNOWN_ROUTES = new Set(['/', '/sense', '/book', '/apply', '/v2', '/chat'])

// novacvm.net is retired. Its homepage now sends people to the Nova CVM practice page on
// novacvm.com, and everything else follows the site to getsensai.co on the same path, query
// intact — so the coded links that went out as novacvm.net/sense?r=XXXX still land on the page
// they were sent for, and still carry their code into the analytics.
// The legacy one-pager stays in the repo at /legacy; nothing serves it any more.
const LEGACY_HOSTS = new Set(['novacvm.net', 'www.novacvm.net'])
const NOVA_HOME = 'https://www.novacvm.com/'
const SENSAI_ORIGIN = 'https://www.getsensai.co'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // /apply folded into /book in round 6: one form, one label. The route stays in the repo.
  if (pathname === '/apply') {
    const book = req.nextUrl.clone()
    book.pathname = '/book'
    return NextResponse.redirect(book, 308)
  }

  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase()
  if (LEGACY_HOSTS.has(host) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    // The homepage goes to the practice page; every other path keeps its shape on getsensai.co.
    const target = pathname === '/'
      ? NOVA_HOME
      : `${SENSAI_ORIGIN}${pathname}${search}`
    return NextResponse.redirect(target, 308)
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
