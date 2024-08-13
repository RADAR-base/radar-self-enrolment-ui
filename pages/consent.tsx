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

    ory
      .toSession()
      .then(({ data }) => {
        setIdentity(data.identity)
      })
      .catch((e) => console.log(e))

    if (!consent_challenge) {
      // router.push("/404")
      return
    }

    fetch(`/api/consent?consent_challenge=${consent_challenge}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error)
        }
        setConsent(data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [router])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement
    const consentAction = submitter.value

    const consentChallenge = formData.get("consent_challenge") as string
    const remember = formData.get("remember") as string
    const grantScope = formData.getAll("grant_scope") as string[]

    if (!consentChallenge || !consentAction) {
      console.error("consentChallenge or consentAction is missing")
      return
    }

    fetch("/api/consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consentChallenge,
        consentAction,
        grantScope,
        remember,
        identity, // Include any additional identity data if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error)
          return
        }
        router.push(data.redirect_to)
      })
      .catch((err) => {
        console.error(err)
      })
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
