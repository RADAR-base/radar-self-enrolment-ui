import { NextResponse } from 'next/server'

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + '/oauth2'
const SEP_REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI ?? ''
const ARMT_REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI ?? ''
const ARMT_CLIENT_ID = process.env.ARMT_CLIENT_ID ?? 'aRMT'
const SEP_CLIENT_ID = process.env.SEP_CLIENT_ID ?? 'SEP'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const scopes = (
    searchParams.get('scopes')?.split(',') ?? [
      'SOURCETYPE.READ',
      'PROJECT.READ',
      'SUBJECT.READ',
      'SUBJECT.UPDATE',
      'SUBJECT.CREATE'
    ]
  ).join(' ')

  const clientId = searchParams.get('clientId')
  const redirectUri =
    clientId === SEP_CLIENT_ID ? SEP_REDIRECT_URI : ARMT_REDIRECT_URI

  const urlParams = [
    ['client_id', clientId],
    ['response_type', searchParams.get('responseType')],
    ['audience', searchParams.get('audience')],
    ['scope', scopes],
    ['redirect_uri', redirectUri],
    ['state', searchParams.get('state')],
  ]

  const authUrl = `${AUTH_BASE_URL}/auth?` + urlParams.map(([k, v]) => `${k}=${encodeURIComponent(v || '')}`).join('&')

  return NextResponse.json({ authUrl })
}
