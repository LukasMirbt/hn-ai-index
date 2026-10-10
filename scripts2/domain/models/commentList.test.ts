import { describe, it, expect } from "vitest";
import type { CommentRow } from "../../localDb/models/commentRowSchema.ts";
import * as CommentListModel from "./commentList.ts";
import { type CommentList } from "./commentList.ts";

describe("commentList", () => {
  describe("fromRows", () => {
    it("returns empty list for no rows", () => {
      const result = CommentListModel.fromRows([]);
      expect(result).toEqual({ items: [] });
    });

    it("maps each row to a comment", () => {
      const rows: CommentRow[] = [
        { id: 2, htmlText: "first" },
        { id: 3, htmlText: "second" },
      ];

      const result = CommentListModel.fromRows(rows);

      const expected: CommentList = {
        items: [
          { id: 2, htmlText: "first" },
          { id: 3, htmlText: "second" },
        ],
      };
      expect(result).toEqual(expected);
    });
  });

  describe("getSlop", () => {
    it("returns only comments mentioning slop", () => {
      const list: CommentList = {
        items: [
          { id: 1, htmlText: "This is AI slop" },
          { id: 2, htmlText: "Great article" },
        ],
      };

      const result = CommentListModel.getSlop(list);

      expect(result).toEqual([{ id: 1, htmlText: "This is AI slop" }]);
    });
  });
});
