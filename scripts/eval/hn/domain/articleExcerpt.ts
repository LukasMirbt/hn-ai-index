import { collapseWhitespace } from "../shared/plainText.js";

const ARTICLE_EXCERPT_MAX_LENGTH = 1500;

export const toArticleExcerpt = (articleText: string): string => {
  const collapsedText = collapseWhitespace(articleText);
  const excerpt = collapsedText.slice(0, ARTICLE_EXCERPT_MAX_LENGTH);
  return excerpt;
};
