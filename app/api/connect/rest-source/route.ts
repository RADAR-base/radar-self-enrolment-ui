import { getConsentRequest } from "@/app/_lib/auth/ory/hydra"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const consentChallenge = request.nextUrl.searchParams.get('consent_challenge')
  if (consentChallenge == null) {
    return NextResponse.json({error: 'No consent challenge provided'}, {status: 400})
  }
  return await getConsentRequest({consent_challenge: consentChallenge})
}