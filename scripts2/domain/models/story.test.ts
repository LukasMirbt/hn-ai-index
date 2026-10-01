import { vi, describe, it, expect } from "vitest";
import * as api from "../../firebaseApi/firebaseApi.ts";
import * as StoryModel from "./story.ts";
import { type Story } from "./story.ts";
import * as DateModel from "./date.ts";

vi.mock("./date.ts");

describe("story", () => {
  describe("from", () => {
    const by = "by";
    const descendants = 1;
    const id = 2;
    const score = 3;
    const time = 4;
    const title = "title";

    const timeAsDate = new Date(4);

    const mockDateFromUnixTimestamp = vi.mocked(DateModel.fromUnixTimestamp);

    it("returns correct values when item fields are undefined", () => {
      const item = {
        by,
        descendants,
        id,
        score,
        time,
        title,
      } as api.Story;

      mockDateFromUnixTimestamp.mockReturnValue(timeAsDate);

      const result = StoryModel.from(item);

      const expected: Story = {
        by,
        descendants,
        id,
        kids: [],
        score,
        time: timeAsDate,
        title,
      };

      expect(result).toEqual(expected);
      expect(mockDateFromUnixTimestamp).toHaveBeenCalledExactlyOnceWith(time);
    });

    it("returns correct values when fields are defined", () => {
      const kids = [5];
      const url = "url";

      const item = {
        by,
        descendants,
        id,
        kids,
        score,
        time,
        title,
        url,
      } as api.Story;

      mockDateFromUnixTimestamp.mockReturnValue(timeAsDate);

      const result = StoryModel.from(item);

      const expected: Story = {
        by,
        descendants,
        id,
        kids,
        score,
        time: timeAsDate,
        title,
        url,
      };

      expect(result).toEqual(expected);
      expect(mockDateFromUnixTimestamp).toHaveBeenCalledExactlyOnceWith(time);
    });
  });
});
