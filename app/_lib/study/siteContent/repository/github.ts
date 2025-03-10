import { GithubService } from "@/app/_lib/github/services/github-service"
import { WebsitePageContent } from "../index"
import { PageRepository } from "./interface"

export class GitHubPageRepository implements PageRepository {
    private githubService: GithubService
    private projectName: string

    constructor(projectName: string) {
        this.githubService = new GithubService()
        this.projectName = projectName
    }

    async getAllStudyIds(): Promise<string[]> {
        try {
            // Get the list of studies (directories) from GitHub using the GithubService
            const studyUriMap = await this.githubService.getDefinitionUriMap(this.projectName, "study", "json")

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
            const pageUriMap = await this.githubService.getDefinitionUriMap(this.projectName, studyId, "json")

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
            // Build the filename based on studyId and route
            const fileName = route.join("/") + ".json"
            const pageUrl = await this.githubService.getDefinitionFileUrl(fileName)

            if (pageUrl) {
                // Fetch the content of the page from GitHub
                const pageContentJson = await this.githubService.fetchGithubContent(pageUrl, true)
                return JSON.parse(pageContentJson) as WebsitePageContent
            }
            return undefined
        } catch (error) {
            console.error(`Error fetching page for studyId ${studyId} and route ${route}:`, error)
            return undefined
        }
    }

    async getLandingPage(studyId: string): Promise<WebsitePageContent> {
        try {
            const fileName = `landingpage.json`
            const landingPageUrl = await this.githubService.getDefinitionFileUrl(fileName)

            if (landingPageUrl) {
                // Fetch the landing page content from GitHub
                const landingPageContentJson = await this.githubService.fetchGithubContent(landingPageUrl, true)
                return JSON.parse(landingPageContentJson) as WebsitePageContent
            }

            throw new Error(`Cannot load landing page for studyId: ${studyId}`)
        } catch (error) {
            console.error(`Error fetching landing page for studyId ${studyId}:`, error)
            throw error
        }
    }
}
