import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  HASH_SALT: Number(process.env.HASH_SALT),
  AUTH_SECRET: String(process.env.AUTH_SECRET),
}));

export const googleConfig = registerAs('google-config', () => ({
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
  CALLBACK_URL: String(process.env.CALLBACK_URL),
}));

export const mongoConfig = () => ({
  uri: process.env.MONGO_URI,
});
