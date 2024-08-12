import {GITHUB_AUTH_CONFIG, GITHUB_CONFIG, GITHUB_REQUEST_TIMEOUT} from "../config/github-config";
import {HeadersInit} from "next/dist/server/web/spec-compliant/headers";

export class GithubClient {
    private authorizationHeader: string;
    private maxContentLength: number;

    constructor() {
        this.authorizationHeader = GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN ? `Bearer ${GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN.trim()}` : "";
        this.maxContentLength = GITHUB_CONFIG.MAX_CONTENT_LENGTH;
    }

    async getData(url: string): Promise<string> {
        const headers: HeadersInit = {
            Accept: GITHUB_CONFIG.ACCEPT_HEADER
        }

        if (this.authorizationHeader) {
            headers.Authorization = this.authorizationHeader;
        }

        const response = await fetch(url, {
            headers: headers,
            method: 'GET',
        })

        if (!response.ok) throw new Error(`Failed to fetch content from GitHub: ${response.statusText}`);

        this.checkContentLength(parseInt(response.headers.get('Content-Length') || '0', 10));

        return await response.json();
    }

    private checkContentLength(contentLength: number) {
        if (contentLength >= this.maxContentLength) {
            throw Error('Data received is too large to process')
        }
    }
}