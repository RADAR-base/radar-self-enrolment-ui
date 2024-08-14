
interface CachedResult<K, V> {
    map: Map<K, V>;
    fetchTime: number
}

export type CachedRetriever<K, V, D> = (...dependencies: D[]) => Promise<Map<K, V>>

export class CachedRecord<K, V, D> {
    private readonly retriever: (...dependencies: D[]) => Promise<Map<K, V>>;
    private readonly expiresAfter: number;
    private cache: CachedResult<K, V>;

    constructor(retriever: CachedRetriever<K, V, D>, invalidateAfter: number) {
        this.retriever = retriever;
        this.expiresAfter = invalidateAfter;
        this.cache = {
            map: new Map<K, V>(),
            fetchTime: 0
        };
    }

    private async retrieve(force: boolean = false, ...dependencies: D[]): Promise<Map<K, V>> {
        if (!force) {
            if (!this.isExpired(this.cache.fetchTime, this.expiresAfter)) {
                console.log("Is data cached: yes")
                return this.cache.map;
            }
        } else console.log("Is data cached: no")
        const result = await this.retriever(...dependencies);
        this.cache = {
            map: result,
            fetchTime: Date.now()
        }
        return result
    }

    async retrieveValue(key: K, ...dependencies: D[]): Promise<V | undefined> {
        const data = this.cache.map.get(key)
        if (data == null || this.isExpired(this.cache.fetchTime, this.expiresAfter)) {
            const result: Map<K, V> = await this.retrieve(true, ...dependencies);
            return result.get(key)
        } else return data
    }

    async retrieveMap(...dependencies: D[]): Promise<Map<K, V>> {
        const data = this.cache.map
        if (data == null || data.size <= 0 || this.isExpired(this.cache.fetchTime, this.expiresAfter)) {
            return await this.retrieve(true, ...dependencies)
        } else return data
    }

    private isExpired(fetchTime: number, refreshDuration: number): boolean {
        const now: number = Date.now();
        return ((now - fetchTime) > refreshDuration)
    }
}