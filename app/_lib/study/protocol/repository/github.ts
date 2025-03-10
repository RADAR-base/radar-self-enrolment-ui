import { GithubService } from "@/app/_lib/github/services/github-service"
import { StudyProtocol } from "../index"
import { StudyProtocolRepository } from "./interface"

export class GitHubProtocolRepository implements StudyProtocolRepository {
    private githubService: GithubService
    private projectName: string

    constructor(projectName: string) {
        this.githubService = new GithubService()
        this.projectName = projectName
    }

    async getStudyProtocol(studyId: string): Promise<StudyProtocol> {
        try {
            // Build the file name for the protocol based on studyId
            const fileName = `protocol.json`
            const protocolFileUrl = await this.githubService.getDefinitionFileUrl(fileName)

            if (protocolFileUrl) {
                // Fetch the protocol content from GitHub
                const protocolContentJson = await this.githubService.fetchGithubContent(protocolFileUrl, true)
                return JSON.parse(protocolContentJson) as StudyProtocol
            }

            throw new Error(`Cannot load study protocol for studyId: ${studyId}`)
        } catch (error) {
            console.error(`Error fetching study protocol for studyId ${studyId}:`, error)
            throw error
        }
    }

    async getStudies(): Promise<string[]> {
        try {
            // Fetch the list of study directories from GitHub using the GithubService
            const studyUriMap = await this.githubService.getDefinitionUriMap(this.projectName, "study", "json")

            // Return the study IDs (keys in the map)
            return Array.from(studyUriMap.keys())
        } catch (error) {
            console.error("Error fetching studies:", error)
            return []
        }
    }
}
