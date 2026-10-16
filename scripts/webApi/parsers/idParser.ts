import type { Element } from "domhandler";
import { ParserTemplate } from "./parserTemplate.ts";

export class IdParser extends ParserTemplate<number> {
  extractText(element: Element): string | undefined {
    return element.attribs.id;
  }

  parseText(text: string): number | undefined {
    const id = parseInt(text, 10);
    if (isNaN(id)) return undefined;
    return id;
  }
}
