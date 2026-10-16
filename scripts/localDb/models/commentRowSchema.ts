import { z } from "zod";

export const commentRowSchema = z.object({
  id: z.int().positive(),
  htmlText: z.string(),
});

export type CommentRow = z.infer<typeof commentRowSchema>;
