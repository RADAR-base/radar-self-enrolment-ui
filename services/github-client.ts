import { GITHUB_AUTH_CONFIG, GITHUB_CONFIG } from "../config/github-config";

/**
 * A client for interacting with the GitHub API.
 * Manages authentication, request headers, content length validation, and error handling.
 */
class GithubClient {
  private readonly authorizationHeader: string;
  private readonly maxContentLength: number;

  constructor() {
    this.authorizationHeader = GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN ? `token ${GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN}` : "";
    this.maxContentLength = GITHUB_CONFIG.MAX_CONTENT_LENGTH;
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
      Authorization: this.authorizationHeader
    };
    const response = await fetch(url, {
      headers,
      method: 'GET',
    });

    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your GitHub token.");
    }

    if (response.status === 403) {
      throw new Error(`Forbidden: ${await response.text()}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch content from GitHub: ${errorText}`);
    }

    this.checkContentLength(parseInt(response.headers.get('Content-Length') || '0', 10));

    return await response.json();
  }

  /**
   * Validates the content length of the API response.
   *
   * @param contentLength The length of the content received from the API.
   * @throws Error if the content length exceeds the maximum allowed limit.
   */
  private checkContentLength(contentLength: number) {
    if (contentLength >= this.maxContentLength) {
      throw new Error('Data received is too large to process');
    }
  }

    this.checkContentLength(parseInt(response.headers.get('Content-Length') || '0', 10));

return await response.json();
  }

  private checkContentLength(contentLength: number) {
  if (contentLength >= this.maxContentLength) {
    throw new Error('Data received is too large to process');
  }
}
}

export default new GithubClient()
