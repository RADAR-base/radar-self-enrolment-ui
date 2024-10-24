import { WebsitePageContent } from "..";

export abstract class PageRepository {
  constructor() {}
  abstract getLandingPage(studyId: string): Promise<WebsitePageContent>
  abstract getAllPageRoutes(studyId: string): Promise<string[]>
  abstract getPage(studyId: string, route: string): Promise<WebsitePageContent>
}