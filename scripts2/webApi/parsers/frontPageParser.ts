import selectAll from "css-select";
import { isTag } from "domhandler";
import { parseDocument } from "htmlparser2";
import * as ItemParser from "./itemParser.ts";
import { type ItemData } from "./itemParser.ts";

export type FrontPageData = {
  items: ItemData[];
};

export function parse(html: string): FrontPageData {
  const document = parseDocument(html);
  const nodes = selectAll(".athing.submission", document.children);
  const elements = nodes.filter((node) => isTag(node));
  const items = elements.map((element) => ItemParser.parse(element));
  return { items };
}
