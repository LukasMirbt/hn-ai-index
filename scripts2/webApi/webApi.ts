import * as FrontPageParser from "./parsers/frontPageParser.ts";
import { type FrontPageData } from "./parsers/frontPageParser.ts";
import * as DateModel from "./models/date.ts";
import * as ItemParser from "./parsers/itemParser.ts";
import { type ItemData } from "./parsers/itemParser.ts";
import { client } from "../webClient/client.ts";

export async function fetchFrontPage(date: Date): Promise<FrontPageData> {
  const day = DateModel.toYYYYMMDD(date);
  const response = await client.get(`front?day=${day}`);
  const html = await response.text();
  const data = FrontPageParser.parse(html);
  return data;
}

export async function fetchItem(id: number): Promise<ItemData> {
  const response = await client.get(`item?id=${id}`);
  const html = await response.text();
  const data = ItemParser.parse(html);
  return data;
}
