import { describe, it, expect } from "vitest";
import * as DateModel from "./date.ts";

describe("date", () => {
  describe("fromUnixTimestamp", () => {
    it("returns correct date", () => {
      const timestamp = 1790780785;
      const result = DateModel.fromUnixTimestamp(timestamp);
      const expected = new Date(1790780785000);
      expect(result).toEqual(expected);
    });
  });
});
