import type { FrontPageItem } from "./frontPageItem.ts";
import * as parser from "../../webApi/parsers/frontPageParser.ts";
import * as FrontPageItemModel from "./frontPageItem.ts";
import type { FrontPageData } from "../../frontPageStorage/frontPageStorage.ts";

export type FrontPage = {
  items: FrontPageItem[];
};

export function fromApi(data: parser.FrontPageData): FrontPage {
  const items = data.items.map(FrontPageItemModel.from);
  return { items };
}

export function fromStorage(data: FrontPage): FrontPageData {
  return data;
}

export function toStorage(data: FrontPage): FrontPageData {
  return data;
}
