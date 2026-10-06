import { selectOne } from "css-select";
import { isTag } from "domhandler";
import { parseDocument } from "htmlparser2";
import * as CommentListParser from "./commentListParser.ts";
import type { CommentData } from "./commentParser.ts";

export type ItemData = {
  comments: CommentData[];
};

const empty: ItemData = { comments: [] };

export function parse(html: string): ItemData {
  const document = parseDocument(html);

  const commentTreeElement = selectOne(".comment-tree", document.children);
  if (!commentTreeElement) return empty;

  const isElement = isTag(commentTreeElement);
  if (!isElement) return empty;

  const comments = CommentListParser.parse(commentTreeElement);
  return { comments };
}
