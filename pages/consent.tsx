import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { MarginCard, CardTitle, TextCenterButton } from "../pkg"
import ory from "../pkg/sdk"

const Consent = () => {
  const router = useRouter()
  const [consent, setConsent] = useState<any>(null)
  const [identity, setIdentity] = useState<any>(null)
  const [csrfToken, setCsrfToken] = useState<string>("")

  useEffect(() => {
    const { consent_challenge } = router.query

    const fetchSessionAndConsent = async () => {
      try {
        const sessionResponse = await ory.toSession()
        const sessionData = sessionResponse.data
        setIdentity(sessionData.identity)

        if (!consent_challenge) {
          console.error("Consent challenge is missing.")
          return
        }

        const consentResponse = await fetch(
          `/api/consent?consent_challenge=${consent_challenge}`,
        )
        const consentData = await consentResponse.json()

        if (consentData.error) {
          throw new Error(consentData.error)
        }

        setConsent(consentData)

        // Automatically handle skipping consent if enabled
        if (consentData.client?.skip_consent) {
          console.log("Skipping consent, automatically submitting.")
          const skipResponse = await fetch("/api/consent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              consentChallenge: consent_challenge,
              consentAction: "accept",
              grantScope: [],
              remember: false,
              identity: sessionData.identity,
            }),
          })
          const skipData = await skipResponse.json()

          if (skipData.error) {
            throw new Error(skipData.error)
          }

          router.push(skipData.redirect_to)
        }
      } catch (error) {
        console.error("Error fetching session or consent:", error)
      }
    }

    if (router.query.consent_challenge) {
      fetchSessionAndConsent()
    }
  }, [router.query])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement
    const consentAction = submitter.value
    const consentChallenge = formData.get("consent_challenge") as string
    const remember = !!formData.get("remember")
    const grantScope = formData.getAll("grant_scope") as string[]

    if (!consentChallenge || !consentAction) {
      console.error("Consent challenge or action is missing.")
      return
    }

    try {
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consentChallenge,
          consentAction,
          grantScope,
          remember,
          identity,
        }),
      })
      const data = await response.json()

      if (data.error) {
        console.error("Error submitting consent:", data.error)
        return
      }

      router.push(data.redirect_to)
    } catch (error) {
      console.error("Error during consent submission:", error)
    }
  }

  if (!consent) {
    return <div>Loading...</div>
  }

  return (
    <MarginCard>
      <div className="center">
        <CardTitle>Consent Request</CardTitle>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="consent_challenge"
            value={consent.challenge}
          />
          <input type="hidden" name="_csrf" value={csrfToken} />
          <div>
            <label className="inputLabel">Client</label>
            <p>{consent.client.client_name || consent.client.client_id}</p>
          </div>
          <div>
            <label className="inputLabel">Requested Scopes</label>
            {consent.requested_scope.map((scope: string) => (
              <div key={scope}>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="grant_scope"
                  value={scope}
                  defaultChecked
                />
                <label className="inputLabel">{scope}</label>
              </div>
            ))}
          </div>
          <br></br>
          <div>
            <input type="checkbox" className="checkbox" name="remember" />
            <label>Remember this decision</label>
          </div>
          <br></br>
          <button
            className="consent-button"
            type="submit"
            name="consent_action"
            value="accept"
          >
            Accept
          </button>
          <button
            className="consent-button"
            type="submit"
            name="consent_action"
            value="deny"
          >
            Deny
          </button>
        </form>
      </div>
    </MarginCard>
  )
}

export default Consent
