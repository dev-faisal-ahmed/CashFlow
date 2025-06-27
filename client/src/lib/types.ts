// Common
export type PromiseResponse<TData = null> = Promise<{ ok: boolean; message: string; data: TData; error: unknown }>;

// User Type
export type LoggedUser = {
  _id: string;
  name: string;
  email: string;
  provider: UserProvider;
};

export type UserProvider = "CREDENTIALS" | "GOOGLE";
