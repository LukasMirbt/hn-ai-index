import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import type { ArticleExtractor } from "../application/ports.js";

const extractText = (html: string, url: string): string | null => {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;
  const reader = new Readability(document);
  const article = reader.parse();
  const articleText = article?.textContent ?? null;
  return articleText;
};

export const readabilityArticleExtractor: ArticleExtractor = { extractText };
