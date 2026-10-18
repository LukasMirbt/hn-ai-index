import { z } from "zod";

export const storageSchema = z.record(z.string(), z.string());

export type Storage = z.infer<typeof storageSchema>;
