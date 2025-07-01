// Common
export type TPromiseResponse<TData = null> = Promise<{ ok: boolean; message: string; data: TData; error: unknown }>;

// User Type
export type TLoggedUser = {
  _id: string;
  name: string;
  email: string;
  provider: TUserProvider;
};

export type TUserProvider = "CREDENTIALS" | "GOOGLE";
