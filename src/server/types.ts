export type TBasePaginationParams = { page: number; limit: number; getAll: boolean };
export type TBaseQueryParams = { search?: string; fields?: string };
export type TRecord<TValue = string> = Record<string, TValue>;

// Shared
export type WithUserId<T = unknown> = { userId: number } & T;
export type IsOwner<TId = number> = WithUserId<{ id: TId }>;
