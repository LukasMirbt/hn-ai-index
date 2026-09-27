import { z } from "zod";
import { idSchema } from "./idSchema.ts";
import type { Story } from "./storySchema.ts";

/* type Item = Job | Story | Comment | Poll | Pollopt; */

export const itemSchema = z.object({
  id: idSchema,
  deleted: z.boolean().optional(),
  type: z.enum(["job", "story", "comment", "poll", "pollopt"]).optional(),
  by: z.string().optional(),
  time: z.int().positive().optional(),
  text: z.string().optional(),
  dead: z.boolean().optional(),
  parent: idSchema.optional(),
  poll: idSchema.optional(),
  kids: z.array(idSchema).optional(),
  url: z.string().optional(),
  score: z.int().optional(),
  title: z.string().optional(),
  parts: z.array(idSchema).optional(),
  descendants: z.int().optional(),
});

export type Item = z.infer<typeof itemSchema>;
