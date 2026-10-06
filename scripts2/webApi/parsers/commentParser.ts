import { Element } from "domhandler";
import { IdParser } from "./idParser.ts";
import { CommentHtmlTextParser } from "./commentHtmlTextParser.ts";
import { IndentParser } from "./indentParser.ts";

export type CommentData = {
  id?: number;
  htmlText?: string;
  indent?: number;
};

export function parse(element: Element): CommentData {
  const id = new IdParser().parse(element);
  const htmlText = new CommentHtmlTextParser().parse(element);
  const indent = new IndentParser().parse(element);

  return {
    id,
    htmlText,
    indent,
  };
}
