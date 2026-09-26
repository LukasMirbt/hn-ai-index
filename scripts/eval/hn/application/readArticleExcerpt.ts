import { toArticleExcerpt } from "../domain/articleExcerpt.js";
import type { ArticleExtractor, ArticleGateway } from "./ports.js";

export const readArticleExcerpt = async (
  gateway: ArticleGateway,
  extractor: ArticleExtractor,
  url: string,
): Promise<string | null> => {
  const html = await gateway.fetchHtml(url);
  if (!html) return null;

  const articleText = extractor.extractText(html, url);
  if (!articleText) return null;

  const excerpt = toArticleExcerpt(articleText);
  return excerpt;
};
