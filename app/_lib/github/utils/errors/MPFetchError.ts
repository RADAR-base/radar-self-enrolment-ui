export class MPFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MPFetchError"

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MPFetchError)
    }
  }
}
