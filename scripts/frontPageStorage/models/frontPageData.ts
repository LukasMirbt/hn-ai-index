import { z } from "zod";
import { frontPageItemSchema } from "./frontPageItemData.ts";

export const frontPageSchema = z.object({
  items: z.array(frontPageItemSchema),
});

export type FrontPageData = z.infer<typeof frontPageSchema>;
