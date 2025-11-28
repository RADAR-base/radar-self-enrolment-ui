export class GithubApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "GithubApiError"
    this.statusCode = statusCode

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GithubApiError)
    }
  }
}
