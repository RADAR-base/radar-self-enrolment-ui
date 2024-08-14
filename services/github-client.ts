import { GITHUB_AUTH_CONFIG, GITHUB_CONFIG } from "../config/github-config";

class GithubClient {
  private readonly authorizationHeader: string;
  private readonly maxContentLength: number;

  constructor() {
    console.log("Constructor Github Client")
    this.authorizationHeader = GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN ? GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN : "";
    this.maxContentLength = GITHUB_CONFIG.MAX_CONTENT_LENGTH;
  }

  getData: (url: string) => Promise<any> = async (url: string) => {
    const headers: HeadersInit = {
      Accept: GITHUB_CONFIG.ACCEPT_HEADER,
      ...(this.authorizationHeader && { Authorization: this.authorizationHeader })
    };
    console.log(headers);
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

  private checkContentLength(contentLength: number) {
    if (contentLength >= this.maxContentLength) {
      throw new Error('Data received is too large to process');
    }
  }
}

export default new GithubClient()
