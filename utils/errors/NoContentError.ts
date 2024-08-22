export class NoContentError extends Error {

    constructor(message: string) {
        super(message);
        this.name = "NoContentError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoContentError);
        }
    }
}
