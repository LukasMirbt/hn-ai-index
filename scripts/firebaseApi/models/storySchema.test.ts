import { describe, it, expect } from "vitest";
import { storySchema, type Story } from "./storySchema.ts";

describe("storySchema", () => {
  const baseStory: Omit<Story, "kids" | "url"> = {
    by: "dhouston",
    descendants: 71,
    id: 8863,
    score: 111,
    time: 1175714200,
    title: "My YC app: Dropbox - Throw away your USB drive",
    type: "story",
  };

  const kids = [
    8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940, 9067,
    8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928, 9125, 8998,
    8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876,
  ];

  const text = "text";
  const url = "http://www.getdropbox.com/u/2/screencast.html";

  it("rejects invalid json", () => {
    const json = { invalid: true };
    const result = storySchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("accepts story without kids, text and url", () => {
    const story = baseStory;
    const result = storySchema.safeParse(story);
    expect(result.success).toBe(true);
  });

  it("accepts story with kids", () => {
    const story: Story = {
      ...baseStory,
      kids,
    };
    const result = storySchema.safeParse(story);
    expect(result.success).toBe(true);
  });

  it("accepts story with text", () => {
    const story: Story = {
      ...baseStory,
      text,
    };
    const result = storySchema.safeParse(story);
    expect(result.success).toBe(true);
  });

  it("accepts story with url", () => {
    const story: Story = {
      ...baseStory,
      url,
    };
    const result = storySchema.safeParse(story);
    expect(result.success).toBe(true);
  });
});
