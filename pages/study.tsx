import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { studyInfo } from "../data/study-questionnaire"
// Import render helpers
import { MarginCard, CardTitle, TextCenterButton, InnerCard } from "../pkg"

// Renders the eligibility page
const Study: NextPage = () => {
  const router = useRouter()
  const [projectId, setProjectId] = useState<string | null>(null)

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (router.isReady) {
      const { projectId } = router.query
      if (typeof projectId === "string") {
        sessionStorage.setItem("project_id", projectId)
        setProjectId(projectId)
      }
    }
  })

  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <MarginCard>
        <CardTitle>{projectId} Research Study</CardTitle>
        <img src="image.png" />
        <StudyInfo questions={studyInfo} />
        <TextCenterButton className="" data-testid="" href="/eligibility">
          Join Now
        </TextCenterButton>
        {/* <Flow onSubmit={onSubmit} flow={flow} /> */}
      </MarginCard>
    </>
  )
}

const StudyInfo: React.FC<any> = ({ questions }) => {
  return (
    <div className="center">
      {questions.map((question: any, index: number) => {
        if (question.field_type === "info") {
          return (
            question.select_choices_or_calculations instanceof Array &&
            question.select_choices_or_calculations.map(
              (info: any, idx: number) => (
                <div key={`${index}-${idx}`}>
                  <label className="inputLabel">{info.code}</label>
                  <InnerCard>{info.label}</InnerCard>
                </div>
              ),
            )
          )
        }
        return null
      })}
    </div>
  )
}

export default Study
