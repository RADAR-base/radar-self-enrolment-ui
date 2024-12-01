import { NextRequest, NextResponse } from "next/server"

const baseURL = process.env.HYDRA_ADMIN_URL

// Helper function to extract session data
const extractSession = (identity: any, grantScope: string[]) => {
  const session: any = {
    access_token: {
      roles: identity.metadata_public.roles,
      scope: identity.metadata_public.scope,
      authorities: identity.metadata_public.authorities,
      sources: identity.metadata_public.sources,
      user_name: identity.metadata_public.mp_login,
    },
    id_token: {},
  }
  return session
}

export async function POST(
  request: NextRequest,
  
  { params }: { params: Promise<{ consentChallenge: string, consentAction: string, grantScope: string[], remember: boolean, identity: any }> }
) {
  const { consentChallenge, consentAction, grantScope, remember, identity } = (await params)
  const session = extractSession(identity, grantScope)
  

  return new NextResponse('D')
}
