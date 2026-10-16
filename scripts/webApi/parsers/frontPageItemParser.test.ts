import { describe, it, expect } from "vitest";
import { Element } from "domhandler";
import * as FrontPageItemParser from "./frontPageItemParser.ts";
import { type FrontPageItemData } from "./frontPageItemParser.ts";

describe("frontPageItemParser", () => {
  describe("parse", () => {
    it("returns correct value", () => {
      const id = "id";
      const attribs: Record<string, string> = { id };
      const element = { attribs } as Element;
      const result = FrontPageItemParser.parse(element);
      const expected: FrontPageItemData = { id };
      expect(result).toEqual(expected);
    });
  });
});
