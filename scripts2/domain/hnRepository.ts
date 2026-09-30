import * as api from "../api/hnApi.ts";
import * as StoryModel from "./models/story.ts";
import * as CommentModel from "./models/comment.ts";
import { type Comment } from "./models/comment.ts";

export * from "./models/story.ts";

export async function fetchStory(id: number) {
  const apiStory = await api.fetchStory(id);
  const story = StoryModel.from(apiStory);
  return story;
}

export async function fetchComment(id: number) {
  const apiComment = await api.fetchComment(id);
  const comment = CommentModel.from(apiComment);
  return comment;
}

export async function fetchCommentList(
  ids: number[],
): Promise<Comment[] | null> {
  const promises = ids.map((id) => api.fetchComment(id));
  const apiComments = await Promise.all(promises);
  const comments = apiComments.map((item) => CommentModel.from(item));
  return comments;
}
