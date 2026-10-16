import type { FrontPageItem } from "./frontPageItem.ts";
import * as parser from "../../webApi/parsers/frontPageParser.ts";
import * as FrontPageItemModel from "./frontPageItem.ts";

export type FrontPage = {
  items: FrontPageItem[];
};

export function from(data: parser.FrontPageData): FrontPage {
  const items = data.items.map(FrontPageItemModel.from);
  return { items };
}
