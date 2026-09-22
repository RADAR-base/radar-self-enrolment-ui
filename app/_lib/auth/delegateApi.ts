"use server"
import { cookies } from 'next/headers'
import { setCookies } from './cookies'

const DELEGATE_API_URL = process.env.DELEGATE_API_URL

async function getCookieString(): Promise<string> {
  return (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join('; ')
}

export async function delegateGet(path: string, params?: URLSearchParams): Promise<Response> {
  if (!DELEGATE_API_URL) return new Response(null, { status: 503 })
  const url = new URL(DELEGATE_API_URL + path)
  if (params) url.search = params.toString()
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      Cookie: await getCookieString(),
    },
  })
  await setCookies(res)
  return res
}

export async function delegatePost(path: string, body: any, params?: URLSearchParams): Promise<Response> {
  if (!DELEGATE_API_URL) return new Response(null, { status: 503 })
  const url = new URL(DELEGATE_API_URL + path)
  if (params) url.search = params.toString()
  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      Cookie: await getCookieString(),
    },
    body: JSON.stringify(body),
  })
  await setCookies(res)
  return res
}
