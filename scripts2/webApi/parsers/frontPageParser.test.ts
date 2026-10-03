import selectAll from "css-select";
import { isTag, type ChildNode, type Document } from "domhandler";
import { parseDocument } from "htmlparser2";
import { vi, describe, it, expect } from "vitest";
import * as FrontPageItemParser from "./frontPageItemParser.ts";
import { type FrontPageItemData } from "./frontPageItemParser.ts";
import type { FrontPageData } from "./frontPageParser.ts";
import * as FrontPageParser from "./frontPageParser.ts";

vi.mock("htmlparser2");
vi.mock("css-select");
vi.mock("domhandler");
vi.mock("./frontPageItemParser.ts");

describe("frontPageParser", () => {
  describe("parse", () => {
    it("returns items", () => {
      const mockParseDocument = vi.mocked(parseDocument);
      const mockSelectAll = vi.mocked(selectAll);
      const mockIsTag = vi.mocked(isTag);
      const mockFrontPageItemParserParse = vi.mocked(FrontPageItemParser.parse);

      const html = "html";

      const firstNode = { name: "name1" } as ChildNode;
      const secondNode = { name: "name2" } as ChildNode;
      const thirdNode = { name: "name3" } as ChildNode;

      const children = [firstNode, secondNode, thirdNode];
      const document = { children } as Document;

      const nodes = [secondNode, thirdNode];
      const item = { id: "id" } as FrontPageItemData;

      mockParseDocument.mockReturnValue(document);
      mockSelectAll.mockReturnValue(nodes);
      mockIsTag.mockReturnValueOnce(false).mockReturnValue(true);
      mockFrontPageItemParserParse.mockReturnValue(item);

      const result = FrontPageParser.parse(html);

      const expected: FrontPageData = {
        items: [item],
      };

      expect(result).toEqual(expected);

      expect(mockParseDocument).toHaveBeenCalledExactlyOnceWith(html);
      expect(mockSelectAll).toHaveBeenCalledExactlyOnceWith(
        ".athing.submission",
        children,
      );
      expect(mockIsTag.mock.calls).toEqual([[secondNode], [thirdNode]]);
      expect(mockFrontPageItemParserParse).toHaveBeenCalledExactlyOnceWith(
        thirdNode,
      );
    });
  });
});
