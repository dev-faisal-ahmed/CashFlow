export type TMeta = { page: number; limit: number; total: number; totalPages: number };

export class ResponseDto<TData> {
  ok: boolean;
  message: string;
  data?: TData;
  meta?: TMeta;

  constructor(message: string, data?: TData, meta?: TMeta) {
    this.ok = true;
    this.message = message;
    this.meta = meta;
    this.data = data;
  }
}
