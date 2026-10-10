import { vi, describe, it, expect } from "vitest";
import { fetchFrontPage, fetchItems } from "./hnRepository.ts";
import * as webApi from "../webApi/webApi.ts";
import * as localDb from "../localDb/localDb.ts";
import * as ItemModel from "./models/item.ts";
import type { FrontPageData } from "../webApi/parsers/frontPageParser.ts";

vi.mock("../webApi/webApi.ts");
vi.mock("../localDb/localDb.ts");
vi.mock("./models/item.ts");
vi.mock("../firebaseApi/firebaseApi.ts");
vi.mock("./models/story.ts");
vi.mock("./models/comment.ts");

describe("hnRepository", () => {
  describe("fetchFrontPage", () => {
    const date = new Date(1);

    const mockFetchFrontPage = vi.mocked(webApi.fetchFrontPage);

    it("fetches and returns front page", async () => {
      const apiPage = { items: [] } as FrontPageData;
      mockFetchFrontPage.mockResolvedValue(apiPage);
      const result = await fetchFrontPage(date);
      expect(result).toEqual(apiPage);
      expect(mockFetchFrontPage).toHaveBeenCalledExactlyOnceWith({ date });
    });
  });

  describe("fetchItems", () => {
    const ids = [2, 1];

    const mockFetchStories = vi.mocked(localDb.fetchStories);
    const mockFromRow = vi.mocked(ItemModel.fromRow);

    it("fetches stories and returns an item per story", async () => {
      const row2 = { id: 2, comments: [] };
      const row1 = { id: 1, comments: [{ id: 3, htmlText: "a" }] };
      const item2 = { commentList: { items: [] }, commentsWithSlop: [] };
      const item1 = { commentList: { items: [] }, commentsWithSlop: [] };
      mockFetchStories.mockResolvedValue([row2, row1]);
      mockFromRow.mockReturnValueOnce(item2).mockReturnValueOnce(item1);

      const result = await fetchItems(ids);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(item2);
      expect(result[1]).toBe(item1);
      expect(mockFetchStories).toHaveBeenCalledExactlyOnceWith(ids);
      expect(mockFromRow.mock.calls.map((call) => call[0])).toEqual([
        row2,
        row1,
      ]);
    });
  });
});
