import { getAuthenticatedUser } from "@/app/_lib/auth/session"
import { generateConsentPdf } from "@/app/_lib/email/paprka"
import { NextResponse } from "next/server"
import { headers } from 'next/headers'

function parseAcceptHeader(accept: string): { type: string; q: number }[] {
  return accept
    .split(',')
    .map(entry => {
      const [type, ...params] = entry.split(';').map(p => p.trim());
      const qParam = params.find(p => p.startsWith('q='));
      const q = qParam ? parseFloat(qParam.slice(2)) : 1;
      return { type, q };
    })
    .sort((a, b) => b.q - a.q);
}

export async function GET() {
  const auth = await getAuthenticatedUser()
  if (!auth.ok) return auth.response

  const acceptType = (await headers()).get('Accept')
  if (acceptType) {
    const prio = parseAcceptHeader(acceptType)[0].type
    if (prio === 'application/json') {
      return NextResponse.json(auth.user.identity.traits.projects[0].consent)
    }
  }
  const blob = await generateConsentPdf(auth.user.session)
  return new NextResponse(blob, { headers: { 'Content-Type': 'application/pdf' } })
}
