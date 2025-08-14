type TMeta = { page: number; limit: number; total: number; totalPage: number };
type TSuccessResponse<TData> = { success: true; message: string; data: TData | null; meta?: TMeta };
type TErrorResponse = { success: false; message: string; data: null; meta?: undefined };
type TResponse<TData> = TSuccessResponse<TData> | TErrorResponse;

export class ApiResponse {
  static success<TData = null>(args: Pick<TSuccessResponse<TData>, "message" | "data" | "meta"> | string): TResponse<TData> {
    if (typeof args === "string") {
      return { success: true, message: args, data: null };
    }
    return { success: true, ...args };
  }

  static error<TData = null>(message: string): TResponse<TData> {
    return { success: false, message, data: null };
  }
}
