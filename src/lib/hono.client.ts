import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { hc } from "hono/client";

const baseUrl = "/api/v1";

export const authClient = hc<TAuthRoute>(`${baseUrl}/auth`);
