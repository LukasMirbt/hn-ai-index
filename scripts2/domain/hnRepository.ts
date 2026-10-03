import * as firebaseApi from "../firebaseApi/firebaseApi.ts";
import * as webApi from "../webApi/webApi.ts";
import * as StoryModel from "./models/story.ts";
import * as CommentModel from "./models/comment.ts";
import { type Comment } from "./models/comment.ts";
import type { FrontPageData } from "../webApi/parsers/frontPageParser.ts";

export * as StoryModel from "./models/story.ts";
export { type Comment } from "./models/comment.ts";
export * as CommentModel from "./models/comment.ts";

export async function fetchFrontPage({
  date,
}: {
  date: Date;
}): Promise<FrontPageData> {
  const apiPage = await webApi.fetchFrontPage({ date });
  return apiPage;
}

export async function fetchStory(id: number) {
  const apiStory = await firebaseApi.fetchStory(id);
  const story = StoryModel.from(apiStory);
  return story;
}

export async function fetchComment(id: number) {
  const apiComment = await firebaseApi.fetchComment(id);
  const comment = CommentModel.from(apiComment);
  return comment;
}

export async function fetchCommentList(ids: number[]): Promise<Comment[]> {
  const promises = ids.map((id) => firebaseApi.fetchComment(id));
  const apiComments = await Promise.all(promises);
  const comments = apiComments.map((item) => CommentModel.from(item));
  return comments;
}
