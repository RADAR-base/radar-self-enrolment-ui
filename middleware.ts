import { NextRequest, NextResponse } from 'next/server'

function generateCspHeaders(nonce: string, isPdfViewer: boolean): string {
  const directives = [
    "default-src 'self'",
    isPdfViewer
      ? "script-src 'self'"
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    isPdfViewer
      ? "style-src 'self' 'unsafe-inline'"
      : `style-src-elem 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https://raw.githubusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ]
  return directives.join('; ')
}

export async function middleware(request: NextRequest) {
  const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? ''
  let pathname = request.nextUrl.pathname
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Strip prefix from incoming requests (ingress forwards as-is)
  let rewriteUrl: URL | undefined
  const assetPrefix = process.env.ASSET_PREFIX ?? ''
  const prefix = [basePath, assetPrefix].find(
    p => p && (pathname.startsWith(p + '/') || pathname === p)
  )
  if (prefix) {
    pathname = pathname.slice(prefix.length) || '/'
    rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = pathname
  }

  // Auth verification redirect
  if (pathname === '/auth/verification') {
    const whoAmIUrl = `${request.nextUrl.origin}${basePath}/api/ory/whoAmI`
    try {
      const sessionRes = await fetch(whoAmIUrl, {
        headers: { cookie: request.headers.get('cookie') ?? '' },
      })

      if (sessionRes.ok) {
        const session = await sessionRes.json()
        const projects: { id: string }[] = session?.identity?.traits?.projects ?? []
        if (projects.length > 0) {
          const target = request.nextUrl.clone()
          target.pathname = `${basePath}/${projects[0].id}/verification`
          const redirectResponse = NextResponse.redirect(target)
          redirectResponse.headers.set('Content-Security-Policy', generateCspHeaders(nonce, false))
          return redirectResponse
        }
      }
    } catch {
      // Let the page handle any errors
    }
  }

  const isPdfViewer = pathname.startsWith('/pdfjs/')
  const csp = generateCspHeaders(nonce, isPdfViewer)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = rewriteUrl
    ? NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source: '/((?!_next/static|_next/image).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
