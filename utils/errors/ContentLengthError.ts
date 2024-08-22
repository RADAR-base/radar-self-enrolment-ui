export class ContentLengthError extends Error {

    constructor(message: string) {
        super(message);
        this.name = "ContentLengthError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ContentLengthError);
        }
    }
}
