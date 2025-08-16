import { hc } from "hono/client";
import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { SERVER_ADDRESS } from "./config";
import { TWalletRoute } from "@/server/modules/wallet/wallet.route";
import { TSourceRoute } from "@/server/modules/source/source.router";

const serverAddress = SERVER_ADDRESS;
const baseUrl = `${serverAddress}/api/v1`;

export const authClient = hc<TAuthRoute>(`${baseUrl}/auth`);
export const walletClient = hc<TWalletRoute>(`${baseUrl}/wallets`);
export const sourceClient = hc<TSourceRoute>(`${baseUrl}/sources`);
