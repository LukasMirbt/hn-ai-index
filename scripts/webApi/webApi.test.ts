import { vi, beforeEach, describe, it, expect } from "vitest";
import * as FrontPageParser from "./parsers/frontPageParser.ts";
import * as DateModel from "./models/date.ts";
import { type FrontPageData } from "./parsers/frontPageParser.ts";
import * as webApi from "./webApi.ts";

vi.mock("./parsers/frontPageParser.ts");
vi.mock("./models/date.ts");

describe("webApi", () => {
  const mockFetch = vi.fn();

  const mockResponse = {
    text: vi.fn(),
  };

  const html = "html";

  describe("baseUrl", () => {
    it("has correct value", () => {
      expect(webApi.baseUrl).toBe("https://news.ycombinator.com");
    });
  });

  describe("fetchFrontPage", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", mockFetch);
      mockFetch.mockResolvedValue(mockResponse);
      mockResponse.text.mockResolvedValue(html);
    });

    it("returns correct data", async () => {
      const date = new Date(1);
      const day = "day";
      const page = { items: [] } as FrontPageData;

      const mockDateToYYYYMMDD = vi.mocked(DateModel.toYYYYMMDD);
      const mockFrontPageParserParse = vi.mocked(FrontPageParser.parse);

      mockDateToYYYYMMDD.mockReturnValue(day);
      mockFrontPageParserParse.mockReturnValue(page);

      const result = await webApi.fetchFrontPage({ date });
      expect(result).toEqual(page);

      expect(mockDateToYYYYMMDD).toHaveBeenCalledExactlyOnceWith(date);
      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(
        `${webApi.baseUrl}/front?day=${day}`,
      );
      expect(mockFrontPageParserParse).toHaveBeenCalledExactlyOnceWith(html);
    });
  });
});
