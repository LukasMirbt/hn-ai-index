import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchStories } from "./localDb.ts";
import { client } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

vi.mock("../localDbClient/client.ts", () => ({
  client: {
    runAndReadAll: vi.fn(),
  },
}));

vi.mock("./models/storyRowSchema.ts", () => ({
  storyRowSchema: {
    parse: vi.fn(),
  },
}));

describe("localDb", () => {
  describe("fetchStories", () => {
    const mockRunAndReadAll = vi.mocked(client.runAndReadAll);
    const mockParse = vi.mocked(storyRowSchema.parse);

    const rawRow = { id: 1, comments: [{ id: 3, htmlText: "text" }] };
    const row: StoryRow = { id: 1, comments: [{ id: 3, htmlText: "text" }] };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("returns empty list without querying when there are no story ids", async () => {
      const result = await fetchStories([]);
      expect(result).toEqual([]);
      expect(mockRunAndReadAll).not.toHaveBeenCalled();
    });

    it("queries the story ids and parses each row", async () => {
      mockRunAndReadAll.mockResolvedValue({
        getRowObjectsJS: () => [rawRow],
      } as unknown as Awaited<ReturnType<typeof client.runAndReadAll>>);
      mockParse.mockReturnValue(row);

      const result = await fetchStories([2, 1]);

      expect(result).toEqual([row]);
      expect(mockParse).toHaveBeenCalledExactlyOnceWith(rawRow);
      const sql = mockRunAndReadAll.mock.calls[0][0];
      expect(sql).toContain("WHERE id > 1");
      expect(sql).toContain("[2, 1]");
    });
  });
});
