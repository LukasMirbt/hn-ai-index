const BASE = "https://hacker-news.firebaseio.com/v0";

interface HnItem {
  id: number;
  title?: string;
  url?: string;
  text?: string;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

const get = (url: string) => fetch(url).then((r) => r.json());

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/&\w+;/g, " ").replace(/\s+/g, " ").trim();

const domain = (url?: string) => {
  try { return url ? new URL(url).hostname.replace(/^www\./, "") : null; }
  catch { return null; }
};

export const fetchTopIds = (n: number): Promise<number[]> =>
  get(`${BASE}/topstories.json`).then((ids: unknown) => (ids as number[]).slice(0, n));

export const fetchItem = (id: number): Promise<HnItem | null> =>
  get(`${BASE}/item/${id}.json`).then((item: unknown) => {
    if (!item || typeof item !== "object" || "error" in item) return null;
    const i = item as HnItem;
    return i?.deleted || i?.dead ? null : i;
  }).catch(() => null);

export const fetchCommentText = async (id: number): Promise<string | null> => {
  const item = await fetchItem(id);
  return item?.text ? stripHtml(item.text) : null;
};

export const fetchPost = async (id: number) => {
  const item = await fetchItem(id);
  if (!item?.title) return null;
  return {
    id: item.id,
    title: item.title,
    url: item.url ?? null,
    domain: domain(item.url),
    text: item.text ? stripHtml(item.text) : null,
    kids: item.kids ?? [],
  };
};
