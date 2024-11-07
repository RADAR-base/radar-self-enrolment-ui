import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL("sessions/whoami", process.env.KRATOS_INTERNAL_URL)
  const res = await fetch(url,
    {
      cache: 'no-cache',
      headers: { 
        'accept': 'application/json',
        Cookie: request.cookies.toString()
        ,
       },
    }) as NextResponse

  return res
}