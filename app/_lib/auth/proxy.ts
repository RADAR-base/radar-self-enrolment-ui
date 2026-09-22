import { cookies } from "next/headers"
import { setCookies } from "./cookies"
import { NextRequest } from "next/server"

const DELEGATE_API_URL = process.env.DELEGATE_API_URL

export async function proxyToDelegate(
  prefix: string,
  request: NextRequest,
  path: string,
  options?: { forwardCookies?: boolean },
) {
  const cookieString = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join('; ')
  const url = new URL(`${DELEGATE_API_URL}/${prefix}/${path}`)
  url.search = request.nextUrl.searchParams.toString()

  const headers: Record<string, string> = {
    'accept': 'application/json',
    Cookie: cookieString,
  }

  const init: RequestInit = { method: request.method, headers, cache: 'no-store' }

  if (request.method === 'POST') {
    headers['Content-Type'] = 'application/json'
    init.body = await request.text()
  }

  const res = await fetch(url, init)
  if (options?.forwardCookies !== false) {
    await setCookies(res)
  }
  return res
}
