export const apiUrl = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    loginWithGoogle: "/auth/login/google",
    changePassword: "/auth/change-password",
  },

  wallet: {
    addWallet: "/wallets",
    getWallets: (searchParams: string) => `/wallets${searchParams}`,
    updateWallet: (walletId: string) => `/wallets/${walletId}`,
  },
};
