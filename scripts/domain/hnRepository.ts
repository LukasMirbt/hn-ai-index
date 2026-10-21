import * as webApi from "../webApi/webApi.ts";
import * as localDb from "../localDb/localDb.ts";
import { type FrontPage } from "./models/frontPage.ts";
import * as FrontPageModel from "./models/frontPage.ts";

export { type Comment } from "./models/comment.ts";
export * as CommentModel from "./models/comment.ts";
export { type CommentList } from "./models/commentList.ts";
export * as CommentListModel from "./models/commentList.ts";

import * as ItemModel from "./models/item.ts";
import { type Item } from "./models/item.ts";
import * as frontPageStorage from "../frontPageStorage/frontPageStorage.ts";
import * as frontPageParser from "../webApi/parsers/frontPageParser.ts";

export function checkIsFrontPageCached(date: Temporal.PlainDate): boolean {
  const isCached = frontPageStorage.checkIfExists(date);
  return isCached;
}

export async function saveFrontPage(date: Temporal.PlainDate): Promise<void> {
  const html = await webApi.fetchFrontPageHtml(date);

  const data = frontPageParser.parse(html);
  const error = data.items.length !== 30;

  if (error) {
    console.log(date, "error");
  }

  frontPageStorage.save({ date, html, error });
}

export async function saveSlop(date: Temporal.PlainDate): Promise<FrontPage> {
  const html = frontPageStorage.read(date);
  const data = frontPageParser.parse(html);
  const page = FrontPageModel.from(data);
  slopStorage.save(slop);
}

export async function fetchItem(id: number): Promise<Item> {
  const data = await webApi.fetchItem(id);
  const item = ItemModel.from(data);
  return item;
}

export async function readItems(ids: number[]): Promise<Item[]> {
  const rows = await Promise.all(ids.map((id) => localDb.readStory(id)));
  const items = rows.map(ItemModel.fromRow);
  return items;
}

/* const slopPath = "./src/data/slop.json";

export function saveMonthResults(monthResults: Record<string, number[]>): void {
  const data = readFile(slopPath);
  const existingResults = JSON.parse(data) as Record<string, number[]>;

  const mergedResults = {
    ...monthResults,
    ...existingResults,
  };

  const mergedJson = JSON.stringify(mergedResults);

  writeFile({
    path: slopPath,
    data: mergedJson,
  });
} */
