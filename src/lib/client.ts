import { hc } from "hono/client";
import { SERVER_ADDRESS } from "./config";

import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { TWalletRoute } from "@/server/modules/wallet/wallet.route";
import { TSourceRoute } from "@/server/modules/source/source.router";
import { TContactRoute } from "@/server/modules/contact/contact.route";
import { TTransactionRoute } from "@/server/modules/transaction/transaction.route";

const serverAddress = SERVER_ADDRESS;
const baseUrl = `${serverAddress}/api/v1`;

export const authClient = hc<TAuthRoute>(`${baseUrl}/auth`);
export const walletClient = hc<TWalletRoute>(`${baseUrl}/wallets`);
export const sourceClient = hc<TSourceRoute>(`${baseUrl}/sources`);
export const contactClient = hc<TContactRoute>(`${baseUrl}/contacts`);
export const transactionClient = hc<TTransactionRoute>(`${baseUrl}/transactions`);
