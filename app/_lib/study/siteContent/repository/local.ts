import { WebsitePageContent } from "../index";
import { PageRepository } from "./interface";
import { promises as fs } from 'fs';
import { glob } from "glob";
import path from "path";

function filePathToParams(p: string) {
  return p.slice(0, -5).split('/')
}

/**
 * Study ids and page route segments are taken from the request URL and used to build
 * a filesystem path, so they are restricted to characters that cannot traverse out of
 * the study directory.
 */
const SAFE_PATH_SEGMENT = /^[A-Za-z0-9_-]+$/

function isSafeSegment(segment: string): boolean {
  return SAFE_PATH_SEGMENT.test(segment)
}

export class LocalPageRepository implements PageRepository {
  async getAllStudyIds(): Promise<string[]> {
    const studyPaths = await glob('public/study/*', { nodir: false })
    return studyPaths.map(path => path.split('/').pop() as string)
  }

  async getAllPageRoutes(studyId: string): Promise<string[][]> {
    if (!isSafeSegment(studyId)) {
      return []
    }
    const pages = await glob('**/**.json', { cwd: 'public/study/' + studyId + '/pages/' })
    return pages.map(filePathToParams)
  }

  async getPage(studyId: string, route: string[]): Promise<WebsitePageContent | undefined> {
    if (!isSafeSegment(studyId) || !route.every(isSafeSegment)) {
      return undefined
    }
    var pageContent: WebsitePageContent
    const fn = '/public/study/' + studyId + '/pages/' + route.join('/') + '.json'
    try {
      const file = await fs.readFile(process.cwd() + fn, 'utf-8')
      pageContent = JSON.parse(file) as WebsitePageContent
      return pageContent
    } catch (err) {
      console.log(err)
    }
    return undefined
  }

  async getLandingPage(studyId: string): Promise<WebsitePageContent> {
    if (!isSafeSegment(studyId)) {
      throw new Error('Can not load study protocol for studyId: ' + studyId)
    }
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