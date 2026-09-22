"use server"
import { NextResponse } from "next/server"
import { whoAmI } from "./ory/kratos"

export type AuthenticatedUser = {
  session: any
  identity: any
  userId: string
  kratosId: string
}

type AuthResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; response: NextResponse }

export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const resp = await whoAmI()
    if (resp.status !== 200) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: { type: 'authentication', content: { message: "No user session" } } },
          { status: 403 },
        ),
      }
    }
    const session = await resp.json()
    const identity = session.identity
    const projects: any[] = identity?.traits?.projects
    return {
      ok: true,
      user: {
        session,
        identity,
        userId: projects?.[0]?.userId ?? identity.id,
        kratosId: identity.id,
      },
    }
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { type: 'authentication', content: { message: "Error decoding user session" } } },
        { status: 403 },
      ),
    }
  }
}
