import { vi, describe, it, expect } from "vitest";
import { fetchFrontPage } from "./hnRepository.ts";
import * as webApi from "../webApi/webApi.ts";
import type { FrontPageData } from "../webApi/parsers/frontPageParser.ts";

vi.mock("../webApi/webApi.ts");
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
});
