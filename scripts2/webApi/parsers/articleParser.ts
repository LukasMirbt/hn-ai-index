import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export type ArticleData = ReturnType<typeof Readability.prototype.parse>;

export function parse({
  html,
  url,
}: {
  html: string;
  url: string;
}): ArticleData {
  const dom = new JSDOM(html, { url });
  const readability = new Readability(dom.window.document);
  const article = readability.parse();
  return article;
}
