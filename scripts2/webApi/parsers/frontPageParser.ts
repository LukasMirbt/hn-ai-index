import selectAll from "css-select";
import { isTag } from "domhandler";
import { parseDocument } from "htmlparser2";

export type FrontPageData = {
  ids: string[];
};

export function parse(html: string): FrontPageData {
  const document = parseDocument(html);
  const nodes = selectAll(".athing.submission", document.children);
  const elements = nodes.filter(isTag);
  const ids = elements.map((item) => item.attribs.id);
  return { ids };
}
