import * as webApi from "../webApi/webApi.ts";
import * as localDb from "../localDb/localDb.ts";
import { type FrontPage } from "./models/frontPage.ts";
import * as FrontPageModel from "./models/frontPage.ts";
import * as fileStorageClient from "../fileStorageClient/fileStorageClient.ts";

export { type Comment } from "./models/comment.ts";
export * as CommentModel from "./models/comment.ts";
export { type CommentList } from "./models/commentList.ts";
export * as CommentListModel from "./models/commentList.ts";

import * as ItemModel from "./models/item.ts";
import { type Item } from "./models/item.ts";
import * as frontPageStorage from "../frontPageStorage/frontPageStorage.ts";

export function checkIsFrontPageCached(date: Temporal.PlainDate): boolean {
  const cached = frontPageStorage.read(date);
  return !!cached;
}

export async function fetchFrontPage(
  date: Temporal.PlainDate,
): Promise<FrontPage> {
  const data = await webApi.fetchFrontPage(date);
  const page = FrontPageModel.fromApi(data);

  const storageData = FrontPageModel.toStorage(page);

  frontPageStorage.save({
    date,
    page: storageData,
  });

  return page;
}

export async function fetchItem(id: number): Promise<Item> {
  const data = await webApi.fetchItem(id);
  const item = ItemModel.from(data);
  return item;
}

export async function fetchItems(ids: number[]): Promise<Item[]> {
  const rows = await Promise.all(ids.map((id) => localDb.readStory2(id)));
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
