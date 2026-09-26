import { describe, expect, it, vi } from "vitest";
import { fetchTopIds } from "./fetchTopIds.js";
import type { HnGateway } from "./ports.js";

const TOP_STORY_IDS = [101, 102, 103, 104, 105];
const COUNT = 3;
const EXPECTED_TOP_IDS = [101, 102, 103];

const hn = {
  fetchTopStoryIds: vi.fn<HnGateway["fetchTopStoryIds"]>(),
  fetchPost: vi.fn<HnGateway["fetchPost"]>(),
  fetchCommentHtml: vi.fn<HnGateway["fetchCommentHtml"]>(),
} satisfies HnGateway;

describe("fetchTopIds", () => {
  it("returns the first top story ids up to the count", async () => {
    hn.fetchTopStoryIds.mockResolvedValue(TOP_STORY_IDS);

    const topIds = await fetchTopIds(hn, COUNT);

    expect(topIds).toEqual(EXPECTED_TOP_IDS);
  });
});
