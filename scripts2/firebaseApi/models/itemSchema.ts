import { z } from "zod";
import { storySchema } from "./storySchema.ts";
import { jobSchema } from "./jobSchema.ts";
import { pollSchema } from "./pollSchema.ts";
import { polloptSchema } from "./polloptSchema.ts";
import { commentSchema } from "./commentSchema.ts";

export const itemSchema = z.union([
  jobSchema,
  storySchema,
  commentSchema,
  pollSchema,
  polloptSchema,
]);

export type Item = z.infer<typeof itemSchema>;
