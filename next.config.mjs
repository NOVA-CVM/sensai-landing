import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  // `/cro` was the comparison version until it became the home page. The links that were shared
  // while it lived there keep working.
  async redirects() {
    return [
      { source: '/cro', destination: '/', permanent: true },
      // Round 9: the chat and the pre-repositioning one-pager are retired. Their old URLs land
      // on the home page; /api/chat no longer exists and returns 404. The destination is
      // absolute because these rules run before middleware: a relative '/' would keep a
      // novacvm.net request on novacvm.net and send it to novacvm.com instead of here.
      { source: '/chat', destination: 'https://www.getsensai.co/', permanent: true },
      { source: '/legacy', destination: 'https://www.getsensai.co/', permanent: true },
    ]
  },
}

export default nextConfig
