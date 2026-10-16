import { z } from "zod";
import { idSchema } from "./idSchema.ts";

export const commentSchema = z.object({
  by: z.string(),
  id: idSchema,
  kids: z.array(idSchema).optional(),
  parent: idSchema,
  text: z.string(),
  time: z.int().positive(),
  type: z.literal("comment"),
});

export type Comment = z.infer<typeof commentSchema>;
