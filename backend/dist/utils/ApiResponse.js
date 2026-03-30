// src/utils/ApiResponse.ts
export class ApiResponse {
    success;
    message;
    data;
    meta;
    constructor(success, message, data = null, meta) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
    static ok(data, message = 'Success', meta) {
        return new ApiResponse(true, message, data, meta);
    }
    static created(data, message = 'Created') {
        return new ApiResponse(true, message, data);
    }
    static error(message) {
        return new ApiResponse(false, message, null);
    }
}
