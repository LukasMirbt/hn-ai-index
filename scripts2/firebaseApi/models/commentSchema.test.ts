import { describe, it, expect } from "vitest";
import { commentSchema, type Comment } from "./commentSchema.ts";

describe("commentSchema", () => {
  const baseComment: Omit<Comment, "kids"> = {
    by: "norvig",
    id: 2921983,
    parent: 2921506,
    text: "Aw shucks, guys ... you make me blush with your compliments.<p>Tell you what, Ill make a deal: I'll keep writing if you keep reading. K?",
    time: 1314211127,
    type: "comment",
  };

  const kids = [2922097, 2922429, 2924562, 2922709, 2922573, 2922140, 2922141];

  it("rejects invalid json", () => {
    const json = { invalid: true };
    const result = commentSchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("accepts comment with kids", () => {
    const comment: Comment = {
      ...baseComment,
      kids,
    };
    const result = commentSchema.safeParse(comment);
    expect(result.success).toBe(true);
  });

  it("accepts comment without kids", () => {
    const comment = baseComment;
    const result = commentSchema.safeParse(comment);
    expect(result.success).toBe(true);
  });
});
