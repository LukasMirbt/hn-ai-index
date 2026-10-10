import { describe, it, expect } from "vitest";
import { commentRowSchema, type CommentRow } from "./commentRowSchema.ts";

describe("commentRowSchema", () => {
  const row: CommentRow = {
    id: 49991368,
    htmlText: "obligatory xkcd",
  };

  it("rejects invalid row", () => {
    const result = commentRowSchema.safeParse({ invalid: true });
    expect(result.success).toBe(false);
  });

  it("accepts valid row", () => {
    const result = commentRowSchema.safeParse(row);
    expect(result.success).toBe(true);
  });

  it("accepts empty htmlText", () => {
    const result = commentRowSchema.safeParse({ ...row, htmlText: "" });
    expect(result.success).toBe(true);
  });
});
