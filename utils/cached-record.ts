interface CachedResult<S, T> {
    map: Map<S, T>;
    fetchTime: number
}

 export type CachedRetriever<S, T> = (...dependencies: string[]) => Promise<Map<S, T>>

export class CachedRecord<S, T> {
    private readonly retriever: (...dependencies: string[]) => Promise<Map<S, T>>;
    private readonly invalidateAfter: number;
    private cache: CachedResult<S, T>;

    constructor(retriever: CachedRetriever<S, T>, invalidateAfter: number) {
        this.retriever = retriever;
        this.invalidateAfter = invalidateAfter;
        this.cache = {
            map: new Map<S, T>(),
            fetchTime: Date.now()
        };
    }

    private async get(force: boolean = false, ...dependencies: string[]): Promise<Map<S, T>> {
        if (!force) {
            if (!this.isStale(this.cache.fetchTime, this.invalidateAfter)) {
                return this.cache.map;
            }
        }

        const result = await this.retriever(...dependencies);
        this.cache = {
            map: result,
            fetchTime: Date.now()
        }
        return result
    }

    async getValue(key: S, ...dependencies: string[]): Promise<T | undefined> {
        const data = this.cache.map.get(key)
        if (data == null || this.isStale(this.cache.fetchTime, this.invalidateAfter)) {
            const result: Map<S, T> = await this.get(true, ...dependencies);
            return result.get(key)
        } else return data
    }

    async getMap(...dependencies: string[]): Promise<Map<S, T>> {
        const data = this.cache.map
        console.log("Cache Map: ", this.cache.map)
        console.log("Data From Cache: ", data)
        if (data == null || data.size <= 0 || this.isStale(this.cache.fetchTime, this.invalidateAfter)) {
            return await this.get(true, ...dependencies)
        } else return data
    }


    private isStale(fetchTime: number, refreshDuration: number): boolean {
        const now: number = Date.now();
        return ((now - fetchTime) > refreshDuration)
    }
}