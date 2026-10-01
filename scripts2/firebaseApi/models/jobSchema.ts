import { z } from "zod";
import { idSchema } from "./idSchema.ts";

export const jobSchema = z.object({
  by: z.string(),
  id: idSchema,
  score: z.int(),
  text: z.string().optional(),
  time: z.int().positive(),
  title: z.string(),
  type: z.literal("job"),
  url: z.string().optional(),
});

export type Job = z.infer<typeof jobSchema>;
