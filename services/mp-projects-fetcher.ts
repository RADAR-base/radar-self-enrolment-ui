import { MP_CONFIG } from "../config/github-config"
import { MPFetchError } from "../utils/errors/MPFetchError"
import { Project } from "../utils/structures"

const MP_PROJECTS_URL = `${MP_CONFIG.BASE_URL}/${MP_CONFIG.PROJECTS_ENDPOINT}`

export default async function fetchProjectsFromMp(): Promise<Project[]> {
  const response = await fetch(MP_PROJECTS_URL)
  if (!response.ok) {
    const errorText = await response.text()
    throw new MPFetchError(
      `Error while fetching projects from Management Portal: ${errorText}`,
    )
  }
  const responseBody = await response.text()
  return JSON.parse(responseBody) as Project[]
}
