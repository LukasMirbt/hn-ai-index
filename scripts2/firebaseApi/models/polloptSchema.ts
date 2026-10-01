import { z } from "zod";
import { idSchema } from "./idSchema.ts";

export const polloptSchema = z.object({
  by: z.string(),
  id: idSchema,
  poll: idSchema,
  score: z.int(),
  text: z.string(),
  time: z.int().positive(),
  type: z.literal("pollopt"),
});

export type Pollopt = z.infer<typeof polloptSchema>;
