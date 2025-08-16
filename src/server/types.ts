export type TBasePaginationParams = { page: number; limit: number; getAll: boolean };
export type TBaseQueryParams = { search?: string; fields?: string };
export type TRecord<TValue = string> = Record<string, TValue>;
