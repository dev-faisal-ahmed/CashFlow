export const apiUrl = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    loginWithGoogle: "/auth/login/google",
    changePassword: "/auth/change-password",
  },

  wallet: {
    add: "/wallets",
    getAll: (searchParams: string) => `/wallets${searchParams}`,
    update: (walletId: string) => `/wallets/${walletId}`,
    delete: (walletId: string) => `/wallets/${walletId}`,
  },

  source: {
    add: "/sources",
    getAll: (searchParams: string) => `/sources${searchParams}`,
    updateOne: (sourceId: string) => `/sources/${sourceId}`,
    deleteOne: (sourceId: string) => `/sources/${sourceId}`,
  },

  contact: {
    add: "/contacts",
    getAll: (searchParams: string) => `/contacts${searchParams}`,
    updateOne: (contactId: string) => `/contacts/${contactId}`,
    deleteOne: (contactId: string) => `/contacts/${contactId}`,
  },

  transactions: {
    transfer: "/transactions/transfer",
  },
};
