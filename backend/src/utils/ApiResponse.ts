// src/utils/ApiResponse.ts
export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    meta?: Record<string, unknown>
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static ok<T>(data: T, message = 'Success', meta?: Record<string, unknown>) {
    return new ApiResponse(true, message, data, meta);
  }

  static created<T>(data: T, message = 'Created') {
    return new ApiResponse(true, message, data);
  }

  static error(message: string) {
    return new ApiResponse(false, message, null);
  }
}
