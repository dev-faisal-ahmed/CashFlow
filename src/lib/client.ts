import { hc } from "hono/client";
import { SERVER_ADDRESS } from "./config";

import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { TWalletRoute } from "@/server/modules/wallet/wallet.route";
import { TCategoryRoute } from "@/server/modules/category/category.route";
import { TContactRoute } from "@/server/modules/contact/contact.route";
import { TTransactionRoute } from "@/server/modules/transaction/transaction.route";

const serverAddress = SERVER_ADDRESS;
const baseUrl = `${serverAddress}/api/v1`;

export const authClient = hc<TAuthRoute>(`${baseUrl}/auth`);
export const walletClient = hc<TWalletRoute>(`${baseUrl}/wallets`);
export const categoryClient = hc<TCategoryRoute>(`${baseUrl}/categories`);
export const contactClient = hc<TContactRoute>(`${baseUrl}/contacts`);
export const transactionClient = hc<TTransactionRoute>(`${baseUrl}/transactions`);
