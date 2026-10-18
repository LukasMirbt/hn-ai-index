import { z } from "zod";
import { frontPageSchema } from "./frontPageData.ts";

export const storageSchema = z.record(z.string(), frontPageSchema);

export type Storage = z.infer<typeof storageSchema>;
