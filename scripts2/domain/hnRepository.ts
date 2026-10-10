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

export async function fetchFrontPage(date: Date): Promise<FrontPage> {
  const data = await webApi.fetchFrontPage(date);
  const page = FrontPageModel.from(data);
  return page;
}

export async function fetchItem(id: number): Promise<Item> {
  const data = await webApi.fetchItem(id);
  const item = ItemModel.from(data);
  return item;
}

export async function fetchItems(ids: number[]): Promise<Item[]> {
  const rows = await localDb.fetchStories(ids);
  const items = rows.map(ItemModel.fromRow);
  return items;
}
