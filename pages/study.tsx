import type {GetServerSideProps, NextPage} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import {MutableRefObject, useEffect, useRef, useState} from "react"

// Import render helpers
import { MarginCard, CardTitle, TextCenterButton, InnerCard } from "../pkg"
import githubService from "../services/github-service";
import {REMOTE_DEFINITIONS_CONFIG} from "../config/github-config";
import {Definition, Project} from "../utils/structures";
import fetchProjectsFromMp from "../services/mp-projects-fetcher";
import {MPFetchError} from "../utils/errors/MPFetchError";
import {ContentLengthError} from "../utils/errors/ContentLengthError";
import {GithubApiError} from "../utils/errors/GithubApiError";
import {NoContentError} from "../utils/errors/NoContentError";

interface StudyPageProps {
  definitions: string;
  projectExists: boolean;
  exceptionMessage: string;
  exceptionStatusCode: number;
}

// Renders the eligibility page
const Study: NextPage<StudyPageProps> = ({definitions, projectExists, exceptionMessage, exceptionStatusCode}) => {
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

  if(exceptionMessage) {
    return (
        <MarginCard>
          <CardTitle>An exception occurred while fetching the project or definitions</CardTitle>
          <p>{exceptionMessage}</p>
          {exceptionStatusCode && <p>Status Code: {exceptionStatusCode}</p>}
        </MarginCard>
    )
  }

  if (projectExists === false) {
    return (
        <MarginCard>
          <CardTitle>Project Not Found</CardTitle>
          <p>The project with the name {projectId} does not exist in the Management Portal.</p>
          <p>Please enter a valid project name.</p>
        </MarginCard>
    )
  }

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
    try {
      const fetchedProjects: Project[] = await fetchProjectsFromMp()
      console.log(fetchedProjects)
      const mpProjectNames: string[] = fetchedProjects.map((project: Project) => project.projectName)
      if (!mpProjectNames.includes(projectId)) {
        console.log("No project found")
        return {
          props: {
            projectExists: false
          }
        };
      }

      const studyDefinitions: string | undefined = await githubService.initiateFetch(projectId,
          REMOTE_DEFINITIONS_CONFIG.STUDY_INFO_DEFINITION_FILE_NAME_CONTENT, REMOTE_DEFINITIONS_CONFIG.STUDY_INFO_VERSION)

return studyDefinitions === undefined 
  ? { props: { projectExists: true } } 
  : { props: { definitions: studyDefinitions, projectExists: true } }
    } catch (error: any) {
      if (error instanceof MPFetchError || error instanceof ContentLengthError || error instanceof NoContentError) {
        return {
          props: {
            exceptionMessage: error.message
          }
        }
      } else if (error instanceof  GithubApiError) {
        return {
          props: {
            exceptionMessage: error.message,
            exceptionStatusCode: error.statusCode
          }
        }
      } else {
        return {
          props: {
            exceptionMessage: error.message
          }
        }
      }
    }
  } else return {props: {projectExists: false}}
}

export default Study