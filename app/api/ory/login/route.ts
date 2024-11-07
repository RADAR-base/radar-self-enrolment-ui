import { parseSetCookie, setCookies } from "@/app/_lib/auth/cookies"
import { submitLoginFlow } from "@/app/_lib/auth/ory/api.server"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const {email, password, csrf_token, flow_id} = await request.json()
  return submitLoginFlow(email, password, csrf_token, flow_id)
  // const {email, password, csrf_token, flow_id} = await request.json()
  // const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  // var url = new URL("self-service/login", process.env.KRATOS_INTERNAL_URL)
  // var params = new URLSearchParams([["flow", flow_id]])
  // url.search = params.toString();
  // const res = await fetch(url, {
  //   cache: 'no-cache',
  //   method: 'POST',
  //   headers: {
  //     'accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Cookie': cookieString,
  //   },
  //   body: JSON.stringify({
  //     method: 'password',
  //     identifier: email,
  //     password: password,
  //     csrf_token: csrf_token,   
  //   })
  // }) as NextResponse
  // return res
}