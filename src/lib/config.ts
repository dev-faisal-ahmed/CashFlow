// Server Address
export const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// DB
export const MONGO_URI = process.env.MONGO_URI;

// Auth
export const SALT = Number(process.env.SALT) ?? 7;
export const AUTH_SECRET = process.env.AUTH_SECRET;
export const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID;
export const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET;
