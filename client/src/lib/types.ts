// --------- Common --------- \\
export type TPromiseResponse<TData = null> = Promise<{ ok: boolean; message: string; data: TData; error: unknown }>;
export type TQuery = Record<string, string>;

// --------- User --------- \\
export type TLoggedUser = {
  _id: string;
  name: string;
  email: string;
  provider: TUserProvider;
};

export type TUserProvider = "CREDENTIALS" | "GOOGLE";

// --------- Wallet --------- \\
export type TWallet = { _id: string; name: string; ownerId: string; isSaving: boolean };

// --------- Source --------- \\
export type TSource = { _id: string; name: string; ownerId: string; budget?: TBudget };
type TBudget = { amount: number; interval: TBudgetInterval };
export type TBudgetInterval = "WEEKLY" | "MONTHLY" | "YEARLY";
