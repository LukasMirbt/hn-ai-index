import type { ItemData } from "../../webApi/parsers/itemParser.ts";
import * as CommentModel from "./comment.ts";
import { type Comment } from "./comment.ts";

export type Item = {
  comments: Comment[];
};

export function from(data: ItemData): Item {
  const comments = data.comments.map(CommentModel.from);
  return { comments };
}
