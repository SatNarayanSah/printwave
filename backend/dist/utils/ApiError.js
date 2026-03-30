// src/utils/ApiError.ts
export class ApiError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
    static badRequest(msg) { return new ApiError(400, msg); }
    static unauthorized(msg = 'Unauthorized') { return new ApiError(401, msg); }
    static forbidden(msg = 'Forbidden') { return new ApiError(403, msg); }
    static notFound(msg) { return new ApiError(404, msg); }
    static conflict(msg) { return new ApiError(409, msg); }
    static internal(msg = 'Internal server error') { return new ApiError(500, msg, false); }
}
