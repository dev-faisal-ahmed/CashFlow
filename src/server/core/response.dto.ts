type TMeta = { page: number; limit: number; total: number; totalPage: number };
type TSuccessResponse<TData = undefined> = { success: true; message: string; data: TData; meta?: TMeta };

export class ResponseDto {
  static success<TData = undefined>(args: Pick<TSuccessResponse<TData>, "message" | "data" | "meta"> | string): TSuccessResponse<TData> {
    if (typeof args === "string") return { success: true, message: args, data: undefined as TData };
    return { success: true, ...args };
  }

  static error(message: string) {
    return { success: false, message };
  }
}
