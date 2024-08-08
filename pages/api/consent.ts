import { NextApiRequest, NextApiResponse } from "next"
import { Configuration, OAuth2Api } from "@ory/client"

const hydra = new OAuth2Api(
  new Configuration({
    basePath: process.env.HYDRA_ADMIN_URL,
    baseOptions: {
      "X-Forwarded-Proto": "https",
      withCredentials: true,
    },
  }),
)

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
      const response = await hydra.getOAuth2ConsentRequest({
        consentChallenge: String(consent_challenge),
      })
      return res.status(200).json(response.data)
    } else {
      if (!consentChallenge || !consentAction) {
        return res.status(400).json({ error: "Missing required parameters" })
      }
      if (consentAction === "accept") {
        const { data: body } = await hydra.getOAuth2ConsentRequest({
          consentChallenge,
        })
        const session = extractSession(identity, grantScope)
        const acceptResponse = await hydra.acceptOAuth2ConsentRequest({
          consentChallenge,
          acceptOAuth2ConsentRequest: {
            grant_scope: grantScope,
            grant_access_token_audience: body.requested_access_token_audience,
            session,
            remember: Boolean(remember),
            remember_for: 3600,
          },
        })
        return res
          .status(200)
          .json({ redirect_to: acceptResponse.data.redirect_to })
      } else {
        const rejectResponse = await hydra.rejectOAuth2ConsentRequest({
          consentChallenge,
          rejectOAuth2Request: {
            error: "access_denied",
            error_description: "The resource owner denied the request",
          },
        })

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
