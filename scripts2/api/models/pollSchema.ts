import { z } from "zod";
import { idSchema } from "./idSchema.ts";

export const pollSchema = z.object({
  by: z.string(),
  descendants: z.int(),
  id: idSchema,
  kids: z.array(idSchema).optional(),
  parts: z.array(idSchema),
  score: z.int(),
  text: z.string().optional(),
  time: z.int().positive(),
  title: z.string(),
  type: z.literal("poll"),
});

export type Poll = z.infer<typeof pollSchema>;
