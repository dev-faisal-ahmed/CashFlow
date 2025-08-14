import z from "zod";

const loginWithCredentials = z.object({ email: z.email("Invalid Email"), password: z.string().nonempty("Password is required") });

export const authValidation = { loginWithCredentials };

export type LoginWithCredentialsDto = z.infer<typeof loginWithCredentials>;
