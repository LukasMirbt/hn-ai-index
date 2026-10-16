import { commentSchema } from "./commentSchema.ts";
import { itemSchema } from "./itemSchema.ts";
import { jobSchema } from "./jobSchema.ts";
import { polloptSchema } from "./polloptSchema.ts";
import { pollSchema } from "./pollSchema.ts";
import { storySchema } from "./storySchema.ts";
import { describe, it, expect } from "vitest";

describe("itemSchema", () => {
  it("has correct options", () => {
    expect(itemSchema.options).toEqual([
      jobSchema,
      storySchema,
      commentSchema,
      pollSchema,
      polloptSchema,
    ]);
  });
});
