import type { ArticleGateway } from "../application/ports.js";

const ARTICLE_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; hn-ai-index/1.0)",
};
const ARTICLE_REQUEST_TIMEOUT_MS = 8000;

const fetchHtml = async (url: string): Promise<string | null> => {
  const signal = AbortSignal.timeout(ARTICLE_REQUEST_TIMEOUT_MS);
  const options = { headers: ARTICLE_REQUEST_HEADERS, signal };
  const response = await fetch(url, options);
  if (!response.ok) return null;
  const html = await response.text();
  return html;
};

export const httpArticleGateway: ArticleGateway = { fetchHtml };
