import { NextRequest, NextResponse } from 'next/server'

function generateCspHeaders(nonce: string, isPdfViewer: boolean): string {
  const directives = [
    "default-src 'self'",
    isPdfViewer
      ? `script-src 'self' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://raw.githubusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://raw.githubusercontent.com",
    "frame-ancestors 'self'",
    "frame-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ]
  return directives.join('; ')
}

export async function middleware(request: NextRequest) {
  const basePath = request.nextUrl.basePath ?? ''
  const pathname = request.nextUrl.pathname
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

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
          target.pathname = `/${projects[0].id}/verification`
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

  const response = NextResponse.next({ request: { headers: requestHeaders } })
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
      source: '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
