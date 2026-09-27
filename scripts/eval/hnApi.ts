import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

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
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const domain = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
};

export const fetchTopIds = (n: number): Promise<number[]> =>
  get(`${BASE}/topstories.json`).then((ids: unknown) =>
    (ids as number[]).slice(0, n),
  );

export async function fetchItem(id: number): Promise<HnItem | null> {
  let item: HnItem | null;

  try {
    const response = await fetch(`${BASE}/item/${id}.json`);
    item = await response.json();
  } catch {
    return null;
  }

  if (!item) return null;
  if (item.deleted) return null;
  if (item.dead) return null;

  return item;
}

export const fetchCommentText = async (id: number): Promise<string | null> => {
  const item = await fetchItem(id);

  if (!item) return null;
  if (!item.text) return null;

  const strippedText = stripHtml(item.text);
  return strippedText;
};

export const fetchBottomCommentIds = (
  kids: number[],
  n: number,
  fetchWindow = 20,
): number[] => kids.slice(-Math.max(n, fetchWindow)).reverse();

export const fetchArticleText = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; hn-ai-index/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    return (
      article?.textContent?.replace(/\s+/g, " ").trim().slice(0, 1500) ?? null
    );
  } catch {
    return null;
  }
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
