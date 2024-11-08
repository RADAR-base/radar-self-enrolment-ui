import { setCookies } from "@/app/_lib/auth/cookies"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  const url = new URL("sessions/whoami", process.env.KRATOS_INTERNAL_URL)
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