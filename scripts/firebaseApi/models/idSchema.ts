import { z } from "zod";

export const idSchema = z.int().positive();
