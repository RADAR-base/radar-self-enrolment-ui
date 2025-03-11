import { GITHUB_CONFIG } from "../config/github-config"
import { CachedRecord, CachedRetriever } from "../utils/cached-record"
import { DataCache, DataCacheOptions } from "../utils/data-cache"
import { NoContentError } from "../utils/errors/NoContentError"

import githubClient from "./github-client"

const options: DataCacheOptions = {
  cacheDuration: GITHUB_CONFIG.CACHE_DURATION, // 3 minutes
  maxSize: GITHUB_CONFIG.CACHE_SIZE, // 50
}

interface TreeNode {
  path: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url: string
}

interface TreeResponse {
  sha?: string
  url?: string
  tree: TreeNode[]
  truncated?: boolean
}

interface GithubFileContent {
  sha?: string
  nodeId?: string
  size?: number
  url?: string
  content: string
  encoding?: string
}

const orgName = GITHUB_CONFIG.ORGANIZATION_NAME
const definitionsRepo = `${orgName}/${GITHUB_CONFIG.REPOSITORY_NAME}`
const definitionsBranch = GITHUB_CONFIG.DEFINITIONS_BRANCH

export class GithubService {
  private dataCache: DataCache<string, string>
  private cachedRecord: CachedRecord<string, string, string>

  constructor() {
    this.dataCache = new DataCache<string, string>(
      githubClient.getData,
      options,
    )
    this.cachedRecord = new CachedRecord(
      this.getPageDefinitionsMap,
      options.cacheDuration,
    )
  }

  async getDefinitionUriMap(
    ...projectFinders: string[]
  ): Promise<Map<string, string>> {
    return this.cachedRecord.retrieveMap(...projectFinders)
  }

  async getDefinitionFileUrl(fileName: string): Promise<string | undefined> {
    return this.cachedRecord.retrieveValue(fileName)
  }

  private getPageDefinitionsMap: CachedRetriever<string, string, string> =
    async (...dependencies: string[]) => {
      const [projectName, definitionsFor, version] = dependencies
      const shaUrl = this.SHAUrl()
      const content = await this.fetchDataWithoutCache(shaUrl)
      const data = JSON.parse(JSON.stringify(content))
      const sha = this.findPathTo(data, "tree", "sha")
      const apiUrl = `${GITHUB_CONFIG.API_URL}/repos/${definitionsRepo}/git/trees/${sha}?recursive=true`
      return await this.getDefinitionDirectories(
        apiUrl,
        projectName,
        definitionsFor,
        version,
      )
    }

  private async getDefinitionDirectories(
    apiUrl: string,
    projectName: string,
    definitionsFor: string,
    version: string,
  ): Promise<Map<string, string>> {
    const content = await this.fetchDataWithoutCache(apiUrl) // check again
    const treeResponse = JSON.parse(JSON.stringify(content)) as TreeResponse
    return this.extractFileUrlMap(
      treeResponse,
      projectName,
      definitionsFor,
      version,
    )
  }

  private SHAUrl(): string {
    return `${GITHUB_CONFIG.API_URL}/repos/${definitionsRepo}/branches/${definitionsBranch}`
  }

  async fetchGithubContent(
    url: string,
    needsDecoding: boolean,
  ): Promise<string> {
    try {
      if (!needsDecoding) {
        return this.dataCache.executeOrThrow(url)
      }
      const fileContent = await this.dataCache.executeOrThrow(url)
      const parsedContent = JSON.parse(
        JSON.stringify(fileContent),
      ) as GithubFileContent
      return this.base64Decoder(parsedContent.content)
    } catch (error) {
      console.error(
        `Failed to fetch or cache content from github url ${url}. Error: ${error}`,
      )
      return ""
    }
  }

  base64Decoder(encodedString: string): string {
    const buffer = Buffer.from(encodedString, "base64")
    return buffer.toString("utf-8")
  }

  /**
   * Use this function if caching is not preferred
   * @param url url to fetch data definitions from
   */
  async fetchDataWithoutCache(url: string): Promise<string> {
    return githubClient.getData(url)
  }

  buildDefinitionFileName(
    projectName: string,
    page: string,
    version: string,
    fileExtension: string,
  ): string {
    return `${projectName}_${page}_${version}.${fileExtension}`
  }

  private findPathTo(
    data: any,
    keyToFind: string,
    valueToFind: string,
  ): string | null {
    if (typeof data !== "object" || data === null) return null

    if (data[keyToFind]) return data[keyToFind][valueToFind] || null

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key]
        const result: string | null = this.findPathTo(
          value,
          keyToFind,
          valueToFind,
        )
        if (result) return result
      }
    }
    return null
  }

  async initiateFetch(
    projectId: string,
    fileNameSubset: string,
  ): Promise<string | undefined> {
    await this.getDefinitionUriMap(projectId, fileNameSubset, "json")
    const fileName = `${fileNameSubset}.json`

    const definitionFileUrl: string | undefined =
      await this.getDefinitionFileUrl(fileName)

    if (definitionFileUrl !== undefined) {
      return await this.fetchGithubContent(definitionFileUrl, true)
    } else {
      throw new NoContentError(
        `No File exists with the name "${fileName}" in the remote definitions repository`,
      )
    }
  }

  private extractFileUrlMap = (
    data: TreeResponse,
    projectName: string,
    definitionsFor: string,
    version: string,
  ): Map<string, string> => {
    return data.tree
      .filter(
        (node: TreeNode) =>
          node.path.includes(projectName) &&
          node.path.endsWith(".json"),
      )
      .reduce((map: Map<string, string>, node: TreeNode) => {
        const fileName = node.path.split("/").pop()
        if (fileName) {
          map.set(fileName, node.url)
        }
        return map
      }, new Map<string, string>())
  }
}

export default new GithubService()
