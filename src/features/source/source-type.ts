import z from "zod";
import { sourceSchema } from "./source-schema";

export type TSourceForm = z.infer<typeof sourceSchema>