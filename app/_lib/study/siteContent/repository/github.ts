import { GithubService } from "@/app/_lib/github/services/github-service"
import { WebsitePageContent } from "../index"
import { PageRepository } from "./interface"
import { REMOTE_DEFINITIONS_CONFIG } from "@/app/_lib/github/config/github-config"

export class GitHubPageRepository implements PageRepository {
    private githubService: GithubService

    constructor() {
        this.githubService = new GithubService()
    }

    async getAllStudyIds(): Promise<string[]> {
        try {
            // Get the list of studies (directories) from GitHub using the GithubService
            const studyUriMap = await this.githubService.getDefinitionUriMap("projects", "json")

            // Return study IDs (which would be the keys in the map)
            return Array.from(studyUriMap.keys())
        } catch (error) {
            console.error("Error fetching study IDs:", error)
            return []
        }
    }

    async getAllPageRoutes(studyId: string): Promise<string[][]> {
        try {
            // Get the map of pages for a specific study
            const pageUriMap = await this.githubService.getDefinitionUriMap(studyId, "json")

            // Return the routes (path parts) for each page
            const routes: string[][] = []
            pageUriMap.forEach((url, fileName) => {
                const route = fileName.slice(0, -5).split('/')  // Remove '.json' extension and split by '/'
                routes.push(route)
            })

            return routes
        } catch (error) {
            console.error(`Error fetching page routes for studyId ${studyId}:`, error)
            return []
        }
    }

    async getPage(studyId: string, route: string[]): Promise<WebsitePageContent | undefined> {
        try {
            const fileName = route.join('/')
            const landingPageContentJson = await this.githubService.initiateFetch(studyId, fileName)
            return JSON.parse(landingPageContentJson!!) as WebsitePageContent
        } catch (error) {
            console.error(`Error fetching page for studyId ${studyId} and route ${route}:`, error)
            return undefined
        }
    }

    async getLandingPage(studyId: string): Promise<WebsitePageContent> {
        try {
            const fileName = REMOTE_DEFINITIONS_CONFIG.LANDING_PAGE_DEFINITION_FILE_NAME_CONTENT
            const landingPageContentJson = await this.githubService.initiateFetch(studyId, fileName)
            return JSON.parse(landingPageContentJson!!) as WebsitePageContent
        } catch (error) {
            console.error(`Error fetching landing page for studyId ${studyId}:`, error)
            throw error
        }
    }
}
