import { describe, it, expect } from "vitest";
import { pollSchema, type Poll } from "./pollSchema.ts";

describe("pollSchema", () => {
  const basePoll: Omit<Poll, "kids" | "text"> = {
    by: "pg",
    descendants: 54,
    id: 126809,
    parts: [126810, 126811, 126812],
    score: 46,
    time: 1204403652,
    title: "Poll: What would happen if News.YC had explicit support for polls?",
    type: "poll",
  };

  const kids = [
    126822, 126823, 126993, 126824, 126934, 127411, 126888, 127681, 126818,
    126816, 126854, 127095, 126861, 127313, 127299, 126859, 126852, 126882,
    126832, 127072, 127217, 126889, 127535, 126917, 126875,
  ];

  const text = "";

  it("rejects invalid json", () => {
    const json = { invalid: true };
    const result = pollSchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("accepts poll without kids and text", () => {
    const poll = basePoll;
    const result = pollSchema.safeParse(poll);
    expect(result.success).toBe(true);
  });

  it("accepts poll with kids", () => {
    const poll: Poll = {
      ...basePoll,
      kids,
    };
    const result = pollSchema.safeParse(poll);
    expect(result.success).toBe(true);
  });

  it("accepts poll with text", () => {
    const poll: Poll = {
      ...basePoll,
      text,
    };
    const result = pollSchema.safeParse(poll);
    expect(result.success).toBe(true);
  });
});
