import { z } from "zod";
import { commentRowSchema } from "./commentRowSchema.ts";

export const storyRowSchema = z.object({
  id: z.int().positive(),
  comments: z.array(commentRowSchema),
});

export type StoryRow = z.infer<typeof storyRowSchema>;
