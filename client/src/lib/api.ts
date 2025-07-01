import axios from "axios";

import { API_URL } from "./config";
import { getToken } from "./server-action";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { ["Content-Type"]: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);
