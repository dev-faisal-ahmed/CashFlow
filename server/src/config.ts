import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  HASH_SALT: Number(process.env.HASH_SALT),
  AUTH_SECRET: String(process.env.AUTH_SECRET),
}));

export const mongoConfig = () => ({
  uri: process.env.MONGO_URI,
});
