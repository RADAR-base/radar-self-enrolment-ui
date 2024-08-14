export type DataCacheOptions = {
    cacheDuration: number;
    maxSize: number;
}

type WorkFunction<K, V> = (key: K) => Promise<V>;

/**
 * Utility class that provides caching functionality for key-value pairs with an expiration policy and size limit.
 *
 * @template K The type of the keys.
 * @template V The type of the values.
 */
export class DataCache<K, V> {

    private readonly cacheDuration: number;
    private readonly maxSize: number;

    private dataMap: Map<K, CachedValue<V>>;
    private readonly work: WorkFunction<K, V>;

    constructor(work: WorkFunction<K, V>, options: DataCacheOptions) {
        this.work = work;
        this.maxSize = options.maxSize;
        this.cacheDuration = options.cacheDuration;
        this.dataMap = new Map<K, CachedValue<V>>();
    }

    /**
     * Executes the work function to retrieve a value for the given key, using the cache if possible.
     * If the value is cached and not expired, returns the cached value.
     * If the value is not cached or expired, executes the work function, caches the result, and returns it.
     *
     * @param key The key for which to retrieve the value.
     * @returns A promise that resolves to the retrieved or cached value.
     * @throws Any exception thrown during the execution of the work function.
     */
    async executeOrThrow(key: K): Promise<V> {
        let result: CachedValue<V> | undefined = this.dataMap.get(key);
        try {
            if (!result || result.isExpired()) {
                const data: V = await this.work(key)
                result = new CachedValue(data, this.cacheDuration)
                this.dataMap.set(key, result)
                this.refreshSize();
            } else{
            }
        } catch (error) {
            result = new CachedValue<V>(undefined, 0, error as Error);
            this.dataMap.set(key, result);
            throw error;
        }
        return result.getOrThrow()
    }

    /**
     * Ensures the cache does not exceed its maximum size.
     * Removes the oldest entries if the cache size exceeds the maximum limit.
     */
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

    /**
     * Returns the cached value or throws an error if the value is undefined or an exception is present.
     *
     * @returns The cached value.
     * @throws The stored exception if one is present, or an error if the value is undefined.
     */
    getOrThrow() {
        if (this.exception) throw this.exception;
        if (this.value == undefined) throw new Error('Cache value is undefined')

        return this.value;
    }
}
