import type { ArticleExtractor, ArticleGateway } from "./ports.js";
import { readArticleExcerpt } from "./readArticleExcerpt.js";

export const fetchArticleText = async (
  gateway: ArticleGateway,
  extractor: ArticleExtractor,
  url: string,
): Promise<string | null> => {
  try {
    const excerpt = await readArticleExcerpt(gateway, extractor, url);
    return excerpt;
  } catch {
    return null;
  }
};
