import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type {GetServerSideProps, NextPage} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import {MutableRefObject, useEffect, useState} from "react"
import { toast } from "react-toastify"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton } from "../pkg"
import githubService from "../services/github-service";
import {REMOTE_DEFINITIONS_CONFIG} from "../config/github-config";
import {Definition} from "../utils/structures";

interface EligibilityFormProps {
  questions: any[]
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

interface EligibilityPageProps {
  definitions: string
}

// Renders the eligibility page
const Eligibility: NextPage<EligibilityPageProps> = ({definitions}) => {
  const IS_ELIGIBLE = "yes"
  const router = useRouter()
  const [eligibility, setEligibility] = useState<boolean>()
  const [eligibilityQuestions, setEligibilityQuestions] = useState<Definition[]>([])

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
    if (definitions != null) {
      setEligibilityQuestions(JSON.parse(definitions) as Definition[])
    }
  }, [router.isReady, definitions])

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
        <EligibilityForm questions={eligibilityQuestions} onSubmit={onSubmit} />
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

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  questions,
  onSubmit,
}) => (
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {projectId} = context.query

  if (typeof projectId === "string") {
    const consentDefinitions: string | undefined = await githubService.initiateFetch(projectId,
        REMOTE_DEFINITIONS_CONFIG.ELIGIBILITY_DEFINITION_FILE_NAME_CONTENT ,REMOTE_DEFINITIONS_CONFIG.ELIGIBILITY_VERSION)

    if (consentDefinitions == undefined) return {props: {}}

    return {
      props: {
        definitions: consentDefinitions,
      }
    }
  } else return {props: {}}
}

export default Eligibility
