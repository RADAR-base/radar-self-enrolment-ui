import { WebsitePageContent } from "../index";
import { PageRepository } from "./interface";
import { promises as fs } from 'fs';
import { glob } from "glob";
import path from "path";

function filePathToParams(p: string) {
  return p.slice(0, -5).split('/')
}

export class LocalPageRepository implements PageRepository {
  async getAllStudyIds(): Promise<string[]> {
    const studyPaths = await glob('public/study/*', { nodir: false })
    return studyPaths.map(path => path.split('/').pop() as string)
  }

  async getAllPageRoutes(studyId: string): Promise<string[][]> {
    const pages = await glob('**/**.json', { cwd: 'public/study/' + studyId + '/pages/' })
    return pages.map(filePathToParams)
  }

  async getPage(studyId: string, route: string[]): Promise<WebsitePageContent> {
    var pageContent: WebsitePageContent
    const fn = '/public/study/' + studyId + '/pages/' + route.join('/') + '.json'
    try {
      const file = await fs.readFile(process.cwd() + fn, 'utf-8')
      pageContent = JSON.parse(file) as WebsitePageContent
      return pageContent
    } catch (err) {
      console.log(err)
    }
    throw new Error('Can not load ' + route)
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