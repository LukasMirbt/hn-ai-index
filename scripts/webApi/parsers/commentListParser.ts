import { selectAll } from "css-select";
import { Element } from "domhandler";
import * as CommentParser from "./commentParser.ts";
import type { CommentData } from "./commentParser.ts";

export function parse(element: Element): CommentData[] {
  const commentElements = selectAll(".athing.comtr", element);
  const comments = commentElements.map(CommentParser.parse);
  return comments;
}
