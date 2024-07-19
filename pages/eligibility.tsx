import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { eligibilityQuestions } from "../data/eligibility-questionnaire"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton } from "../pkg"

// Renders the eligibility page
const Eligibility: NextPage = () => {
  const IS_ELIGIBLE = "yes"
  const router = useRouter()
  const [eligibility, setEligibility] = useState(null)
  const questions: any[] = eligibilityQuestions

  const checkEligibility = async (values: any) => {
    // Eligibility check
    return values.is_eligible == IS_ELIGIBLE
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
    setEligibility(eligible)

    if (eligible) {
      sessionStorage.setItem("eligible", JSON.stringify(formValues))
      toast.success("Congrats, you're eligible!", {
        position: toast.POSITION.TOP_CENTER,
        closeButton: false,
        onClose: () => router.push("/registration"),
      })
    }
  }

  return (
    <>
      <Head>
        <title>Eligibility</title>
      </Head>
      {eligibility === false ? (
        <NotEligibleMessage />
      ) : (
        <EligibilityForm questions={questions} onSubmit={onSubmit} />
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

const EligibilityForm = ({ questions, onSubmit }) => (
  <MarginCard>
    <CardTitle>Eligibility Screening</CardTitle>
    <form method="POST" onSubmit={onSubmit}>
      {questions.map((question) => {
        const isRequired = question.required_field === "yes"
        return (
          <div key={question.field_name}>
            <label className="inputLabel" htmlFor={question.field_name}>
              {question.field_label}
            </label>
            <input
              id={question.field_name}
              name={question.field_name}
              type={question.field_type}
              required={isRequired}
            />
          </div>
        )
      })}
      <br />
      <button type="submit">Next</button>
    </form>
  </MarginCard>
)

export default Eligibility
