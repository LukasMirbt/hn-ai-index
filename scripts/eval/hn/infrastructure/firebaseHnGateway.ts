import type { HnPost } from "../domain/hnPost.js";
import type { HnGateway } from "../application/ports.js";
import { getJson } from "./getJson.js";
import { isLiveItem, isStory, type HnItem } from "./hnItem.js";
import { toPost } from "./hnPostMapper.js";

const HN_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";

const topStoriesUrl = () => `${HN_API_BASE_URL}/topstories.json`;

const itemUrl = (id: number) => `${HN_API_BASE_URL}/item/${id}.json`;

const fetchTopStoryIds = async (): Promise<number[]> => {
  const url = topStoriesUrl();
  const ids = await getJson<number[]>(url);
  return ids;
};

const fetchPost = async (id: number): Promise<HnPost | null> => {
  const item = await fetchLiveItem(id);
  const itemIsStory = isStory(item);
  if (!itemIsStory) return null;
  const post = toPost(item);
  return post;
};

const fetchCommentHtml = async (id: number): Promise<string | null> => {
  const item = await fetchLiveItem(id);
  const html = item?.text ?? null;
  return html;
};

const fetchLiveItem = async (id: number): Promise<HnItem | null> => {
  try {
    const url = itemUrl(id);
    const item = await getJson<unknown>(url);
    const itemIsLive = isLiveItem(item);
    if (!itemIsLive) return null;
    return item;
  } catch {
    return null;
  }
};

export const firebaseHnGateway: HnGateway = {
  fetchTopStoryIds,
  fetchPost,
  fetchCommentHtml,
};
