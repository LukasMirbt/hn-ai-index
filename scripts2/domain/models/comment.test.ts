import { vi, describe, it, expect } from "vitest";
import * as api from "../../api/hnApi.ts";
import * as CommentModel from "./comment.ts";
import { type Comment } from "./comment.ts";
import * as DateModel from "./date.ts";

vi.mock("./date.ts");

describe("comment", () => {
  describe("from", () => {
    const by = "by";
    const id = 1;
    const parent = 2;
    const text = "text";
    const time = 3;

    const timeAsDate = new Date(4);

    const mockDateFromUnixTimestamp = vi.mocked(DateModel.fromUnixTimestamp);

    it("returns correct values when item fields are undefined", () => {
      const item = {
        by,
        id,
        parent,
        text,
        time,
      } as api.Comment;

      mockDateFromUnixTimestamp.mockReturnValue(timeAsDate);

      const result = CommentModel.from(item);

      const expected: Comment = {
        by,
        id,
        kids: [],
        parent,
        text,
        time: timeAsDate,
      };

      expect(result).toEqual(expected);
      expect(mockDateFromUnixTimestamp).toHaveBeenCalledExactlyOnceWith(time);
    });

    it("returns correct values when fields are defined", () => {
      const kids = [5];

      const item = {
        by,
        id,
        kids,
        parent,
        text,
        time,
      } as api.Comment;

      mockDateFromUnixTimestamp.mockReturnValue(timeAsDate);

      const result = CommentModel.from(item);

      const expected: Comment = {
        by,
        id,
        kids,
        parent,
        text,
        time: timeAsDate,
      };

      expect(result).toEqual(expected);
      expect(mockDateFromUnixTimestamp).toHaveBeenCalledExactlyOnceWith(time);
    });
  });
});
