import type { ItemData } from "../../webApi/parsers/itemParser.ts";
import type { StoryRow } from "../../localDb/models/storyRowSchema.ts";
import type { CommentList } from "./commentList.ts";
import * as CommentListModel from "./commentList.ts";
import { type Comment } from "./comment.ts";

export type Item = {
  commentList: CommentList;
  commentsWithSlop: Comment[];
};

export function from(data: ItemData): Item {
  const commentList = CommentListModel.from(data);
  const commentsWithSlop = CommentListModel.getSlop(commentList);
  return { commentList, commentsWithSlop };
}

export function fromRow(row: StoryRow): Item {
  const commentList = CommentListModel.fromRows(row.comments);
  const commentsWithSlop = CommentListModel.getSlop(commentList);
  return { commentList, commentsWithSlop };
}
