import {GithubClient} from "./github-client";
import {DataCache} from "../utils/data-cache";
import {DataCacheOptions} from "../utils/data-cache"

const options: DataCacheOptions = {
    cacheDuration: 30 * 60 * 1000, // 5 minutes
    maxSize: 5
}

export class GithubService {

    private client: GithubClient
    private cache: DataCache<string, string>

    constructor(client: GithubClient) {
        this.client = new GithubClient()
        this.cache = new DataCache<string, string>(
            this.client.getData,
            options
        )
    }

    // async getContent(url: string): Promise<string> {
    //
    // }
}