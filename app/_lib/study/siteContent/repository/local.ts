import { WebsitePageContent } from "../index";
import { PageRepository } from "./interface";
import { promises as fs } from 'fs';
import path from "path";

export class LocalPageRepository implements PageRepository {
  async getAllPageRoutes(studyId: string): Promise<string[][]> {
    let dir = await fs.opendir('public/study/paprka/pages')
    return [['asd'], ['asd', 'zxc']]
  }
  getPage(studyId: string, route: string): Promise<WebsitePageContent> {
    throw new Error("Method not implemented.");
  }
  async getLandingPage(studyId: string): Promise<WebsitePageContent> {
    var pageContent: WebsitePageContent
    try {
      const file = await fs.readFile(process.cwd() + '/public/study/' + studyId + '/landingpage.json', 'utf-8')
      pageContent = JSON.parse(file) as WebsitePageContent
      return pageContent
    } catch (err) {
      console.log(err)
    }
    throw new Error('Can not load study protocol for studyId: ' + studyId)
  }
}