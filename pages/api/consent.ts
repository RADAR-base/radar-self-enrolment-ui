import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { consentChallenge, consentAction, grantScope, remember, identity } =
    req.body

  try {
    if (req.method === "GET") {
      const { consent_challenge } = req.query
      const response = await axios.get(
        `${baseURL}/oauth2/auth/requests/consent`,
        {
          params: {
            consent_challenge: String(consent_challenge),
          },
        },
      )
      return res.status(200).json(response.data)
    } else {
      if (!consentChallenge || !consentAction) {
        return res.status(400).json({ error: "Missing required parameters" })
      }
      if (consentAction === "accept") {
        const { data: body } = await axios.get(
          `${baseURL}/oauth2/auth/requests/consent`,
          {
            params: { consent_challenge: consentChallenge },
          },
        )

        const session = extractSession(identity, grantScope)
        const acceptResponse = await axios.put(
          `${baseURL}/oauth2/auth/requests/consent/accept?consent_challenge=${consentChallenge}`,
          {
            grant_scope: session.access_token.scope,
            grant_access_token_audience: body.requested_access_token_audience,
            session,
            remember: Boolean(remember),
            remember_for: 3600,
          },
        )
        return res
          .status(200)
          .json({ redirect_to: acceptResponse.data.redirect_to })
      } else {
        const rejectResponse = await axios.put(
          `${baseURL}/oauth2/auth/requests/consent/${consentChallenge}/reject`,
          {
            error: "access_denied",
            error_description: "The resource owner denied the request",
          },
        )

        return res
          .status(200)
          .json({ redirect_to: rejectResponse.data.redirect_to })
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
