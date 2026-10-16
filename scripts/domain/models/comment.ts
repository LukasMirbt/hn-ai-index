import type { CommentData } from "../../webApi/parsers/commentParser.ts";
import type { CommentRow } from "../../localDb/models/commentRowSchema.ts";

export type Comment = {
  id?: number;
  htmlText?: string;
  indent?: number;
};

export function from(item: CommentData): Comment {
  return {
    id: item.id,
    htmlText: item.htmlText,
    indent: item.indent,
  };
}

export function fromRow(row: CommentRow): Comment {
  return {
    id: row.id,
    htmlText: row.htmlText,
  };
}

const slopRegex = /\bslops?\b/i;

export function hasSlop(comment: Comment): boolean {
  const text = comment.htmlText;
  if (!text) return false;
  const hasSlop = slopRegex.test(text);
  return hasSlop;
}
