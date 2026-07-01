import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const basePath = request.nextUrl.basePath ?? ''
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
        return NextResponse.redirect(target)
      }
    }
  } catch {
    // Let the page handle any errors
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/verification'],
}
