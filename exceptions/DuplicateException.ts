export function DuplicateException(message: string) {
    return new Error(message);
}

DuplicateException.prototype = Object.create(Error.prototype);