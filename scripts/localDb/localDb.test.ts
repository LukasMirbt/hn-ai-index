import { vi, describe, it, expect } from "vitest";
import { fetchStories, readStory } from "./localDb.ts";
import { client } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

describe("localDb", () => {
  describe("readStory", () => {
    it("returns correct data", async () => {
      const result = await readStory(43411898);
      expect(result.comments.length).toBe(21);
    });
  });
});
