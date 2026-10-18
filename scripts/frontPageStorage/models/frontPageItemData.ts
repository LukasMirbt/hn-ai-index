import { z } from "zod";

export const frontPageItemSchema = z.object({
  id: z.int().positive(),
});

export type FrontPageDataItem = z.infer<typeof frontPageItemSchema>;
