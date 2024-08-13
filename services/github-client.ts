import {GITHUB_AUTH_CONFIG, GITHUB_CONFIG} from "../config/github-config";
import {HeadersInit} from "next/dist/server/web/spec-compliant/headers";

export class GithubClient {
    private readonly authorizationHeader: string;
    private readonly maxContentLength: number;

    constructor() {
        this.authorizationHeader = GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN ? `Bearer ${GITHUB_AUTH_CONFIG.GITHUB_AUTH_TOKEN.trim()}` : "";
        this.maxContentLength = GITHUB_CONFIG.MAX_CONTENT_LENGTH;
    }

    getData: (url: string) => Promise<string>  = async (url: string)=>  {
        console.log("CP 2", url)
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

        if (!response.ok) throw new Error(`Failed to fetch content from GitHub: ${await response.text()}`);

        this.checkContentLength(parseInt(response.headers.get('Content-Length') || '0', 10));

        return await response.json();
    }

    private checkContentLength(contentLength: number) {
        if (contentLength >= this.maxContentLength) {
            throw Error('Data received is too large to process')
        }
    }
}