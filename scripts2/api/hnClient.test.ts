import { describe, expect, it } from "vitest";
import { baseUrl } from "./hnClient.ts";

describe("hnClient", () => {
  describe("baseUrl", () => {
    it("has correct value", () => {
      expect(baseUrl).toBe("https://hacker-news.firebaseio.com/v0/");
    });
  });
});
