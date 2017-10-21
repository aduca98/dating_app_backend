export interface IException {
    type: string,
    message: string
}

export default class Exception {
    public type;
    public message;

    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
    }

}

/**
 * defaultApiError(): status: number * type: string * message * string -> {Object}
 * @param {number} status: http status
 * @param {string} type: type of error, ie "not_authenticated"
 * @param {string} message: error message
 * 
 * @return {Object}: json with info
 */
export function defaultApiError(status: number, type: string, message: string) {
    const json = {
        status,
        type,
        message
    }
    return json;
}