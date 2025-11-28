import { setCookies } from "@/app/_lib/auth/cookies"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const cookieString = (await cookies()).getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL(process.env.KRATOS_INTERNAL_URL + "/sessions/whoami")
  const res = await fetch(url,
    {
      headers: {
        'accept': 'application/json',
        Cookie: cookieString,
      },
    })
  setCookies(res)
  return res
}