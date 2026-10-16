import { selectOne } from "css-select";
import type { Element } from "domhandler";

import { ParserTemplate } from "./parserTemplate.ts";

export class IndentParser extends ParserTemplate<number> {
  extractText(element: Element): string | undefined {
    const indentElement = selectOne(".ind", element);
    if (indentElement === null) return undefined;
    return indentElement.attribs.indent;
  }

  parseText(text: string): number | undefined {
    const indent = parseInt(text, 10);
    if (isNaN(indent)) return undefined;
    return indent;
  }
}
