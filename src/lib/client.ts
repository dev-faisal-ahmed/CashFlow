import { hc } from "hono/client";
import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { SERVER_ADDRESS } from "./config";

const serverAddress = SERVER_ADDRESS;
const baseUrl = `${serverAddress}/api/v1`;

export const authClient = hc<TAuthRoute>(`${baseUrl}/auth`);
