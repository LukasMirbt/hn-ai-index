import type { HnGateway } from "./ports.js";

export const fetchTopIds = async (
  hn: HnGateway,
  count: number,
): Promise<number[]> => {
  const ids = await hn.fetchTopStoryIds();
  const topIds = ids.slice(0, count);
  return topIds;
};
