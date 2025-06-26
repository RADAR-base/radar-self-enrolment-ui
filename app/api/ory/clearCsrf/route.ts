import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const cookieNames = cookieStore.getAll().map((c) => c.name)

  cookieNames.forEach((name: string) => {
      if ((name.includes('csrf')) || (name.includes('hydra'))) {
        cookieStore.delete(name)
      }
    }
  )
  return new NextResponse("ok")
}