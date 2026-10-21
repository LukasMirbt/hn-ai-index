import { vi, describe, it, expect } from "vitest";
import { fetchStories, readStory } from "./localDb.ts";
import { client } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

describe("localDb", () => {
  describe("readStory", () => {
    it("returns correct data", async () => {
      const result = await readStory(20003863);
      expect(result).toEqual([
        {
          dead: 0,
          deleted: 0,
          id: 20003863,
          kids: [20003872, 20003972, 20003957],
        },
      ]);
    });
  });
});
