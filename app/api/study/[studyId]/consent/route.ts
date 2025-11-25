import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { generateConsentPdf } from "@/app/_lib/email/paprka"
import { NextResponse } from "next/server"
import { headers } from 'next/headers'

type MimePreference = {
  type: string;
  q: number;
};

function parseAcceptHeader(accept: string): MimePreference[] {
  return accept
    .split(',')
    .map(entry => {
      const [type, ...params] = entry.split(';').map(p => p.trim());
      const qParam = params.find(p => p.startsWith('q='));
      const q = qParam ? parseFloat(qParam.slice(2)) : 1;
      return { type, q };
    })
    .sort((a, b) => b.q - a.q); // highest q-value first
}

export async function GET(
  request: Request
) {
  const userResp = await whoAmI()
  if (userResp.status != 200) {
    return NextResponse.json({error: {type: 'authentication', content: {message: "No user session"}}}, {status: 403})
  }
  const user = (await userResp.json())
  const acceptType = ((await headers()).get('Accept'))
  if (acceptType) {
    const prio = parseAcceptHeader(acceptType)[0]['type']
    if (prio == 'application/json') {
      return NextResponse.json(user['identity']['traits']['projects'][0]['consent'])

    }
  }
  const blob = await generateConsentPdf(user)
  return new NextResponse(blob, {headers: {'Content-Type': 'application/pdf'}})
}