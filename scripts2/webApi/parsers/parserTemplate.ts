import type { Element } from "domhandler";

export abstract class ParserTemplate<T> {
  abstract extractText(item: Element): string | undefined;

  abstract parseText(text: string): T | undefined;

  parse(item: Element): T | undefined {
    const text = this.extractText(item);
    if (text === undefined) return undefined;
    return this.parseText(text);
  }
}