import { GithubService } from "@/app/_lib/github/services/github-service"
import { StudyProtocol } from "../index"
import { StudyProtocolRepository } from "./interface"
import { REMOTE_DEFINITIONS_CONFIG } from "@/app/_lib/github/config/github-config"

export class GitHubProtocolRepository implements StudyProtocolRepository {
    private githubService: GithubService

    constructor() {
        this.githubService = new GithubService()
    }

    async getStudyProtocol(studyId: string): Promise<StudyProtocol> {
        try {
            const fileName = REMOTE_DEFINITIONS_CONFIG.PROTOCOL_DEFINITION_FILE_NAME_CONTENT
            const landingPageContentJson = await this.githubService.initiateFetch(studyId, fileName)
            return JSON.parse(landingPageContentJson!!) as StudyProtocol
        } catch (error) {
            console.error(`Error fetching study protocol for studyId ${studyId}:`, error)
            throw error
        }
    }

    async getStudies(): Promise<string[]> {
        try {
            // Fetch the list of study directories from GitHub using the GithubService
            const studyUriMap = await this.githubService.getDefinitionUriMap("projects", "json")

            // Return the study IDs (keys in the map)
            return Array.from(studyUriMap.keys())
        } catch (error) {
            console.error("Error fetching studies:", error)
            return []
        }
    }
}
