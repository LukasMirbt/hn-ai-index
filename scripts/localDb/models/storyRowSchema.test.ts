import { describe, it, expect } from "vitest";
import { storyRowSchema, type StoryRow } from "./storyRowSchema.ts";

describe("storyRowSchema", () => {
  const row: StoryRow = {
    id: 49991227,
    comments: [{ id: 49991368, htmlText: "obligatory xkcd" }],
  };

  it("rejects invalid row", () => {
    const result = storyRowSchema.safeParse({ invalid: true });
    expect(result.success).toBe(false);
  });

  it("accepts story with comments", () => {
    const result = storyRowSchema.safeParse(row);
    expect(result.success).toBe(true);
  });

  it("accepts story without comments", () => {
    const result = storyRowSchema.safeParse({ ...row, comments: [] });
    expect(result.success).toBe(true);
  });
});
