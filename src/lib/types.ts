// Common
export type ToString<TValue> = {
  [key in keyof TValue]: string;
};
