/**
 * Represents a cached result containing a map of key-value pairs and the time it was fetched.
 *
 * @template K The type of the keys in the map.
 * @template V The type of the values in the map.
 */
interface CachedResult<K, V> {
  map: Map<K, V>
  fetchTime: number
}

export type CachedRetriever<K, V, D> = (
  ...dependencies: D[]
) => Promise<Map<K, V>>

/**
 * A class for caching and retrieving key-value pairs with an expiration policy.
 *
 * @template K The type of the keys in the map.
 * @template V The type of the values in the map.
 * @template D The type of the dependencies required to fetch the data.
 */
export class CachedRecord<K, V, D> {
  private readonly retriever: (...dependencies: D[]) => Promise<Map<K, V>>
  private readonly expiresAfter: number
  private cache: CachedResult<K, V>

  /**
   * Initializes a new instance of the CachedRecord class.
   *
   * @param retriever A function that retrieves the data asynchronously.
   * @param invalidateAfter The duration (in milliseconds) after which the cache expires.
   */
  constructor(retriever: CachedRetriever<K, V, D>, invalidateAfter: number) {
    this.retriever = retriever
    this.expiresAfter = invalidateAfter
    this.cache = {
      map: new Map<K, V>(),
      fetchTime: 0,
    }
  }

  /**
   * Retrieves the data, either from the cache or by invoking the retriever function.
   *
   * @param force If true, forces data retrieval even if the cache is not expired.
   * @param dependencies The dependencies required for the retriever function.
   * @returns A promise that resolves to a map of key-value pairs.
   */
  private async retrieve(
    force: boolean = false,
    ...dependencies: D[]
  ): Promise<Map<K, V>> {
    if (!force) {
      if (!this.isExpired(this.cache.fetchTime, this.expiresAfter)) {
        return this.cache.map
      }
    }
    const result = await this.retriever(...dependencies)
    this.cache = {
      map: result,
      fetchTime: Date.now(),
    }
    return result
  }

  /**
   * Retrieves a value by its key from the cache or fetches it if the cache is expired.
   *
   * @param key The key of the value to retrieve.
   * @param dependencies The dependencies required for the retriever function.
   * @returns A promise that resolves to the value associated with the key, or undefined if not found.
   */
  async retrieveValue(key: K, ...dependencies: D[]): Promise<V | undefined> {
    const data = this.cache.map.get(key)
    if (
      data == null ||
      this.isExpired(this.cache.fetchTime, this.expiresAfter)
    ) {
      const result: Map<K, V> = await this.retrieve(true, ...dependencies)
      return result.get(key)
    } else return data
  }

  /**
   * Retrieves the entire map from the cache or fetches it if the cache is expired.
   *
   * @param dependencies The dependencies required for the retriever function.
   * @returns A promise that resolves to a map of key-value pairs.
   */
  async retrieveMap(...dependencies: D[]): Promise<Map<K, V>> {
    const data = this.cache.map
    if (
      data == null ||
      data.size <= 0 ||
      this.isExpired(this.cache.fetchTime, this.expiresAfter)
    ) {
      return await this.retrieve(true, ...dependencies)
    } else return data
  }

  private isExpired(fetchTime: number, refreshDuration: number): boolean {
    const now: number = Date.now()
    return now - fetchTime > refreshDuration
  }
}
