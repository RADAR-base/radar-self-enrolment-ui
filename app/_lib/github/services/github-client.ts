import { GITHUB_AUTH_CONFIG, GITHUB_CONFIG } from "../config/github-config"
import { ContentLengthError } from "../utils/errors/ContentLengthError"
import { GithubApiError } from "../utils/errors/GithubApiError"

/**
 * A client for interacting with the GitHub API.
 * Manages authentication, request headers, content length validation, and error handling.
 */
class GithubClient {
  private readonly authorizationHeader: string
  private readonly maxContentLength: number

  constructor() {
    this.authorizationHeader = GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN
      ? `token ${GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN}`
      : ""
    this.maxContentLength = GITHUB_CONFIG.MAX_CONTENT_LENGTH
  }

  /**
   * Fetches data from a specified GitHub API URL.
   *
   * @param url The GitHub API endpoint URL.
   * @returns A promise that resolves to the fetched data in JSON format.
   * @throws Error if the request is unauthorized, forbidden, or if the response content is too large.
   */
  getData: (url: string) => Promise<any> = async (url: string) => {
    const headers = {
      Accept: GITHUB_CONFIG.ACCEPT_HEADER,
      Authorization: this.authorizationHeader,
    }
    const response = await fetch(url, {
      headers,
      method: "GET",
    })

    if (response.status === 401) {
      throw new GithubApiError(
        "Unauthorized: Please check your GitHub token.",
        401,
      )
    }

    if (response.status === 403) {
      throw new GithubApiError(
        `Forbidden: You have exceeded the rate limit or do not have permission to access this resource.`,
        403,
      )
    }

    if (response.status === 404) {
      throw new GithubApiError(
        `Not Found: The requested resource could not be found on GitHub.`,
        404,
      )
    }

    if (response.status === 500) {
      throw new GithubApiError(
        `Internal Server Error: GitHub is experiencing issues. Please try again later.`,
        500,
      )
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new GithubApiError(
        `Failed to fetch content from GitHub: ${errorText || "Unknown error occurred"
        }`,
        response.status,
      )
    }

    this.checkContentLength(
      parseInt(response.headers.get("Content-Length") || "0", 10),
    )

    return await response.json()
  }

  /**
   * Validates the content length of the API response.
   *
   * @param contentLength The length of the content received from the API.
   * @throws Error if the content length exceeds the maximum allowed limit.
   */
  private checkContentLength(contentLength: number) {
    if (contentLength >= this.maxContentLength) {
      throw new ContentLengthError(
        "Data received from github is too large to process",
      )
    }
  }
}

export default new GithubClient()
