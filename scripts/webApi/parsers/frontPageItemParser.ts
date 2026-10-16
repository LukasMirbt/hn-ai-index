import { type Element } from "domhandler";

export type FrontPageItemData = {
  id: string;
};

export function parse(element: Element): FrontPageItemData {
  const id = element.attribs.id;
  return { id };
}
