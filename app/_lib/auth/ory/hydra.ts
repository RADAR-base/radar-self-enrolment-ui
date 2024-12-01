"use server"
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

const BASEURL = process.env.HYDRA_ADMIN_URL;

export async function getConsentRequest(params: {consent_challenge: string}): Promise<NextResponse> {
  let url = new URL("/admin/oauth2/auth/requests/consent", BASEURL)
  let urlParams = new URLSearchParams([['consent_challenge', params.consent_challenge]])
  url.search = urlParams.toString()
  const res = await fetch(url, {
    cache: 'no-cache',
    headers: { 
      'accept': 'application/json',
    },
  }) as NextResponse
  return res
}



export async function acceptConsentRequest(params: {consent_challenge: string, grant_scope?: string[], remember?: boolean, rememberFor?: number, identity?: any, grant_access_token_audience?: string}): Promise<string> {
  let url = new URL("/admin/oauth2/auth/requests/consent/accept", BASEURL)
  let urlParams = new URLSearchParams([['consent_challenge', params.consent_challenge]])
  url.search = urlParams.toString()
  const res = await fetch(url, {
    cache: 'no-cache',
    method: 'PUT',
    headers: { 
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_scope: params.grant_scope,
      grant_access_token_audience: params.grant_access_token_audience,
      remember: params.remember,
      remember_for: params.rememberFor,
      session: params.identity
    })
  }) as NextResponse
  console.log(res)
  console.log(await res.json())
  return '' // (await res.json())['redirect_to']
}
