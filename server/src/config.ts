export const hashSaltConfig = () => ({
  HASH_SALT: Number(process.env.HASH_SALT),
});

export const mongoConfig = () => ({
  uri: process.env.MONGO_URI,
});
