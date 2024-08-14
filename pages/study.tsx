import type {GetServerSideProps, NextPage} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import {MutableRefObject, useEffect, useRef, useState} from "react"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton, InnerCard } from "../pkg"
import githubService from "../services/github-service";
import {REMOTE_DEFINITIONS_CONFIG} from "../config/github-config";
import {Definition} from "../utils/structures";

interface StudyPageProps {
  definitions: string
}

// Renders the eligibility page
const Study: NextPage<StudyPageProps> = ({definitions}) => {
  const router = useRouter()
  const [projectId, setProjectId] = useState<string | null>(null)
  const studyInfo: MutableRefObject<Definition[]> = useRef([])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (router.isReady) {
      const {projectId} = router.query
      if (definitions != null) {
        studyInfo.current = JSON.parse(definitions) as Definition[]
      }
      if (typeof projectId === "string") {
        sessionStorage.setItem("project_id", projectId)
        setProjectId(projectId)
      }
    }
  }, [router.query, router.isReady, definitions])

  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <MarginCard>
        <CardTitle>{projectId} Research Study</CardTitle>
        <img src="image.png" />
        <StudyInfo questions={studyInfo.current} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {projectId} = context.query
  if (typeof projectId === "string") {
    const studyDefinitions: string | undefined = await githubService.initiateFetch(projectId,
        REMOTE_DEFINITIONS_CONFIG.STUDY_INFO_DEFINITION_FILE_NAME_CONTENT, REMOTE_DEFINITIONS_CONFIG.STUDY_INFO_VERSION)

    if (studyDefinitions == undefined) return {props: {}}

    return {
      props: {
        definitions: studyDefinitions,
      }
    }
  } else return {props: {}}
}

export default Study
