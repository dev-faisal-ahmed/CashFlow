export type TMeta = { page: number; limit: number; total: number; totalPages: number };
type TResponseDtoArgs<TData> = { message: string; data?: TData; meta?: TMeta };
export class ResponseDto<TData> {
  ok: boolean;
  message: string;
  meta?: TMeta;
  data?: TData;

  constructor(args: TResponseDtoArgs<TData> | string) {
    this.ok = true;
    this.message = typeof args === 'string' ? args : args.message;
    this.meta = typeof args === 'string' ? undefined : args.meta;
    this.data = typeof args === 'string' ? undefined : args.data;
  }
}
