import { type Element } from "domhandler";

export type ItemData = {
  id: string;
};

export function parse(element: Element): ItemData {
  const id = element.attribs.id;
  return { id };
}
