import selectAll from "css-select";
import { isTag } from "domhandler";
import { parseDocument } from "htmlparser2";
import * as FrontPageItemParser from "./frontPageItemParser.ts";
import { type FrontPageItemData } from "./frontPageItemParser.ts";

export type FrontPageData = {
  items: FrontPageItemData[];
};

export function parse(html: string): FrontPageData {
  const document = parseDocument(html);
  const nodes = selectAll(".athing.submission", document.children);
  const elements = nodes.filter((node) => isTag(node));
  const items = elements.map((element) => FrontPageItemParser.parse(element));
  return { items };
}
