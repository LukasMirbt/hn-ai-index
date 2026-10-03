import { describe, it, expect } from "vitest";
import { Element } from "domhandler";
import * as ItemParser from "./itemParser.ts";
import { type ItemData } from "./itemParser.ts";

describe("itemParser", () => {
  describe("parse", () => {
    it("returns correct value", () => {
      const id = "id";
      const attribs: Record<string, string> = { id };
      const element = { attribs } as Element;
      const result = ItemParser.parse(element);
      const expected: ItemData = { id };
      expect(result).toEqual(expected);
    });
  });
});
