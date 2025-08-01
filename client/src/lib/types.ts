// --------- Common --------- \\
export type TPromiseResponse<TData = null> = Promise<{ ok: boolean; message: string; meta?: TMeta; data: TData; error: unknown }>;
export type TMeta = { page: number; limit: number; total: number; totalPages: number };
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
export type TSource = { _id: string; name: string; type: TSourceType; ownerId: string; budget?: TBudget };

export type TSourceType = "INCOME" | "EXPENSE";
export type TBudget = { amount: number; interval: TBudgetInterval };
export type TBudgetInterval = "WEEKLY" | "MONTHLY" | "YEARLY";

// --------- Contact --------- \\
export type TContact = { _id: string; name: string; phone: string; address?: string; userId: string };
