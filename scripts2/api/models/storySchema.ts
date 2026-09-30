import { z } from "zod";
import { idSchema } from "./idSchema.ts";

export const storySchema = z.object({
  by: z.string(),
  descendants: z.int(),
  id: idSchema,
  kids: z.array(idSchema).optional(),
  score: z.int(),
  text: z.string().optional(),
  time: z.int().positive(),
  title: z.string(),
  type: z.literal("story"),
  url: z.string().optional(),
});

export type Story = z.infer<typeof storySchema>;
