import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton } from "../pkg"

// Renders the eligibility page
const Eligibility: NextPage = () => {
  const IS_ELIGIBLE = "yes"
  const router = useRouter()
  const [isEligible, setIsEligible] = useState(null)

  const checkEligibility = async (values: any) => {
    // Eligibility check
    return values.fitbit == IS_ELIGIBLE
  }

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady) {
      return
    }
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formValues = Object.fromEntries(formData.entries())
    const eligible = await checkEligibility(formValues)
    setIsEligible(eligible)

    if (eligible) {
      localStorage.setItem("formData", JSON.stringify(formValues))
      toast.success("Congrats, you're eligible!", {
        position: toast.POSITION.TOP_CENTER,
        onClose: () => router.push("/registration"),
      })
    }
  }

  return (
    <>
      <Head>
        <title>Eligibility</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      {isEligible === false ? (
        <NotEligibleMessage />
      ) : (
        <EligibilityForm onSubmit={onSubmit} />
      )}
    </>
  )
}

const NotEligibleMessage = () => (
  <MarginCard>
    <CardTitle>Not Eligible</CardTitle>
    <div>Unfortunately, you are not eligible to join the study.</div>
    <TextCenterButton href="/study">Back</TextCenterButton>
  </MarginCard>
)

const EligibilityForm = ({ onSubmit }) => (
  <MarginCard>
    <CardTitle>Eligibility Screening</CardTitle>
    <form method="POST" onSubmit={onSubmit}>
      <div>
        <label className="inputLabel">Age</label>
        <input id="age" name="age" type="text" required />
      </div>
      <div>
        <label className="inputLabel">City</label>
        <input id="city" name="city" type="text" required />
      </div>
      <div>
        <label className="inputLabel">Do you have a Fitbit?</label>
        <input id="has_fitbit" name="fitbit" type="text" required />
      </div>
      <br></br>
      <button type="submit">Next</button>
    </form>
  </MarginCard>
)

export default Eligibility
