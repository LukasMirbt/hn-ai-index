import * as FrontPageParser from "./parsers/frontPageParser.ts";
import { type FrontPageData } from "./parsers/frontPageParser.ts";
import * as DateModel from "./models/date.ts";
import * as ArticleParser from "./parsers/articleParser.ts";
import { type ArticleData } from "./parsers/articleParser.ts";
import * as ItemParser from "./parsers/itemParser.ts";
import { type ItemData } from "./parsers/itemParser.ts";

export const baseUrl = "https://news.ycombinator.com";

export async function fetchFrontPage({
  date,
}: {
  date: Date;
}): Promise<FrontPageData> {
  const day = DateModel.toYYYYMMDD(date);
  const response = await fetch(`${baseUrl}/front?day=${day}`);
  const html = await response.text();
  const data = FrontPageParser.parse(html);
  return data;
}

export async function fetchItem(id: number): Promise<ItemData> {
  const response = await fetch(`${baseUrl}/item?id=${id}`);
  const html = await response.text();
  const data = ItemParser.parse(html);
  return data;
}

export async function fetchArticle(url: string): Promise<ArticleData> {
  const response = await fetch(url);
  const html = await response.text();
  const data = ArticleParser.parse({ html, url });
  return data;
}
