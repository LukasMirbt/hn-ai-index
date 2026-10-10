import type { ItemData } from "../../webApi/parsers/itemParser.ts";
import type { Comment } from "./comment.ts";
import * as CommentModel from "./comment.ts";

export type CommentList = {
  items: Comment[];
};

export function from(data: ItemData): CommentList {
  const items = data.comments.map(CommentModel.from);
  return { items };
}

export function getSlop(list: CommentList): Comment[] {
  const commentsWithSlop = list.items.filter((item) =>
    CommentModel.hasSlop(item),
  );
  return commentsWithSlop;
}
