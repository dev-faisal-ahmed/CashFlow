export class ResponseDto<TData> {
  ok: boolean;
  message: string;
  data: TData | null;

  constructor(message: string, data: TData | null = null) {
    this.ok = true;
    this.message = message;
    this.data = data;
  }
}
