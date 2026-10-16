import { vi, describe, it, expect } from "vitest";
import type { StoryRow } from "../../localDb/models/storyRowSchema.ts";
import * as CommentListModel from "./commentList.ts";
import * as ItemModel from "./item.ts";
import { type Item } from "./item.ts";

vi.mock("./commentList.ts");

describe("item", () => {
  describe("fromRow", () => {
    const mockFromRows = vi.mocked(CommentListModel.fromRows);
    const mockGetSlop = vi.mocked(CommentListModel.getSlop);

    it("builds comment list and slop comments from row", () => {
      const row: StoryRow = {
        id: 1,
        comments: [{ id: 2, htmlText: "This is slop" }],
      };
      const commentList = { items: [{ id: 2, htmlText: "This is slop" }] };
      const commentsWithSlop = commentList.items;
      mockFromRows.mockReturnValue(commentList);
      mockGetSlop.mockReturnValue(commentsWithSlop);

      const result = ItemModel.fromRow(row);

      const expected: Item = { commentList, commentsWithSlop };
      expect(result).toEqual(expected);
      expect(mockFromRows).toHaveBeenCalledExactlyOnceWith(row.comments);
      expect(mockGetSlop).toHaveBeenCalledExactlyOnceWith(commentList);
    });
  });
});
