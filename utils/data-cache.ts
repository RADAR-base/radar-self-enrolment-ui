export type DataCacheOptions = {
    cacheDuration: number;
    maxSize: number;
}

type WorkFunction<K, V> = (key: K) => Promise<V>;

export class DataCache<K, V> {

    private readonly cacheDuration: number;
    private readonly maxSize: number;

    private dataMap: Map<K, CachedValue<V>>;
    private readonly work: WorkFunction<K, V>;

    constructor(work: WorkFunction<K, V>, options: DataCacheOptions) {
        this.work = work;
        this.maxSize = options.maxSize;
        this.cacheDuration = options.cacheDuration;
        this.dataMap = new Map();
    }

    async executeWithException(key: K): Promise<V> {
        let result: CachedValue<V> | undefined = this.dataMap.get(key);
        try {
            if (!result || result.isExpired()) {
                const data: V = await this.work(key)
                result = new CachedValue(data, this.cacheDuration)
                this.dataMap.set(key, result)
                this.refreshSize();
            }
        } catch (error) {
            result = new CachedValue<V>(undefined, 0, error as Error);
            this.dataMap.set(key, result);
            throw error;
        }
        return result.getOrThrow()
    }

    private refreshSize() {
        if (this.dataMap.size > this.maxSize) {
            const keys: K[] = Array.from(this.dataMap.keys());

            for (let i = 0; i < keys.length - this.maxSize; i++) {
                this.dataMap.delete(keys[i])
            }
        }
    }
}

class CachedValue<T> {
    private readonly value: T | undefined;
    private readonly expiration: number;
    private readonly exception: Error | undefined;

    constructor(value: T | undefined, duration: number, exception?: Error) {
        this.value = value;
        this.exception = exception;
        this.expiration = Date.now() + duration;
    }

    isExpired(): boolean {
        return this.expiration < Date.now();
    }

    getOrThrow() {
        if (this.exception) throw this.exception;
        if (this.value == undefined) throw new Error('Cache value is undefined')

        return this.value;
    }
}
