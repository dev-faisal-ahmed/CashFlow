// Common
export type PromiseResponse<TData = null> = Promise<{ ok: boolean; message: string; data: TData; error: unknown }>;
