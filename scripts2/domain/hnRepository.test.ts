import { vi, describe, it, expect } from "vitest";
import { fetchStory, fetchComment, fetchCommentList } from "./hnRepository.ts";
import * as api from "../api/hnApi.ts";
import * as StoryModel from "./models/story.ts";
import { type Story } from "./models/story.ts";
import * as CommentModel from "./models/comment.ts";
import { type Comment } from "./models/comment.ts";

vi.mock("../api/hnApi.ts");
vi.mock("./models/story.ts");
vi.mock("./models/comment.ts");

describe("hnRepository", () => {
  describe("fetchStory", () => {
    const id = 1;

    const mockApiFetchStory = vi.mocked(api.fetchStory);
    const mockStoryFrom = vi.mocked(StoryModel.from);

    it("fetches and returns story", async () => {
      const apiStory = { type: "story" } as api.Story;
      const story = { by: "by" } as Story;

      mockApiFetchStory.mockResolvedValue(apiStory);
      mockStoryFrom.mockReturnValue(story);

      const result = await fetchStory(id);
      expect(result).toEqual(story);

      expect(mockApiFetchStory).toHaveBeenCalledExactlyOnceWith(id);
      expect(mockStoryFrom).toHaveBeenCalledExactlyOnceWith(apiStory);
    });
  });

  describe("fetchComment", () => {
    const id = 1;

    const mockApiFetchComment = vi.mocked(api.fetchComment);
    const mockCommentFrom = vi.mocked(CommentModel.from);

    it("fetches and returns comment", async () => {
      const apiComment = { type: "comment" } as api.Comment;
      const comment = { by: "by" } as Comment;

      mockApiFetchComment.mockResolvedValue(apiComment);
      mockCommentFrom.mockReturnValue(comment);

      const result = await fetchComment(id);
      expect(result).toEqual(comment);

      expect(mockApiFetchComment).toHaveBeenCalledExactlyOnceWith(id);
      expect(mockCommentFrom).toHaveBeenCalledExactlyOnceWith(apiComment);
    });
  });

  describe("fetchCommentList", () => {
    const ids = [1, 2];

    const firstApiComment = { by: "by1" } as api.Comment;
    const secondApiComment = { by: "by2" } as api.Comment;

    const firstComment = { text: "text1" } as Comment;
    const secondComment = { text: "text2" } as Comment;

    const mockApiFetchComment = vi.mocked(api.fetchComment);
    const mockCommentFrom = vi.mocked(CommentModel.from);

    const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

    it("fetches and returns comment list", async () => {
      const firstCall = Promise.withResolvers<api.Comment>();
      const secondCall = Promise.withResolvers<api.Comment>();

      mockApiFetchComment
        .mockReturnValueOnce(firstCall.promise)
        .mockReturnValueOnce(secondCall.promise);

      mockCommentFrom
        .mockReturnValueOnce(firstComment)
        .mockReturnValueOnce(secondComment);

      let settled = false;

      const resultPromise = fetchCommentList(ids).finally(() => {
        settled = true;
      });

      expect(mockApiFetchComment).toHaveBeenNthCalledWith(1, ids[0]);
      expect(mockApiFetchComment).toHaveBeenNthCalledWith(2, ids[1]);

      secondCall.resolve(secondApiComment);
      await flush();
      expect(settled).toBe(false);

      firstCall.resolve(firstApiComment);
      await flush();
      expect(settled).toBe(true);

      await expect(resultPromise).resolves.toEqual([
        firstComment,
        secondComment,
      ]);

      expect(mockCommentFrom).toHaveBeenNthCalledWith(1, firstApiComment);
      expect(mockCommentFrom).toHaveBeenNthCalledWith(2, secondApiComment);
    });
  });
});
