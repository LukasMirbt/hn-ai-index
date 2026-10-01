import { vi, describe, expect, it } from "vitest";
import {
  baseUrl,
  fetchComment,
  fetchItem,
  fetchJob,
  fetchPoll,
  fetchPollopt,
  fetchStory,
} from "./firebaseApi.ts";
import { beforeEach } from "vitest";
import { itemSchema, type Item } from "./models/itemSchema.ts";
import { storySchema, type Story } from "./models/storySchema.ts";
import { jobSchema, type Job } from "./models/jobSchema.ts";
import { pollSchema, type Poll } from "./models/pollSchema.ts";
import { commentSchema, type Comment } from "./models/commentSchema.ts";
import { polloptSchema, type Pollopt } from "./models/polloptSchema.ts";

vi.mock("./models/itemSchema.ts", () => ({
  itemSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("./models/storySchema.ts", () => ({
  storySchema: {
    parse: vi.fn(),
  },
}));

vi.mock("./models/commentSchema.ts", () => ({
  commentSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("./models/jobSchema.ts", () => ({
  jobSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("./models/pollSchema.ts", () => ({
  pollSchema: {
    parse: vi.fn(),
  },
}));

vi.mock("./models/polloptSchema.ts", () => ({
  polloptSchema: {
    parse: vi.fn(),
  },
}));

describe("hnFirebaseApi", () => {
  const id = 1;
  const itemUrl = `${baseUrl}/item/${id}.json`;
  const json = {};

  const mockFetch = vi.fn();
  const mockResponse = {
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockResolvedValue(mockResponse);
    mockResponse.json.mockResolvedValue(json);
  });

  describe("baseUrl", () => {
    it("has correct value", () => {
      expect(baseUrl).toBe("https://hacker-news.firebaseio.com/v0");
    });
  });

  describe("fetchItem", () => {
    it("fetches and returns item", async () => {
      const item = { by: "by" } as Item;
      const mockItemSchemaParse = vi.mocked(itemSchema.parse);
      mockItemSchemaParse.mockReturnValue(item);

      const result = await fetchItem(id);
      expect(result).toEqual(item);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockItemSchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });

  describe("fetchStory", () => {
    it("fetches and returns story", async () => {
      const story = { type: "story" } as Story;
      const mockStorySchemaParse = vi.mocked(storySchema.parse);
      mockStorySchemaParse.mockReturnValue(story);

      const result = await fetchStory(id);
      expect(result).toEqual(story);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockStorySchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });

  describe("fetchComment", () => {
    it("fetches and returns comment", async () => {
      const comment = { type: "comment" } as Comment;
      const mockCommentSchemaParse = vi.mocked(commentSchema.parse);
      mockCommentSchemaParse.mockReturnValue(comment);

      const result = await fetchComment(id);
      expect(result).toEqual(comment);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockCommentSchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });

  describe("fetchJob", () => {
    it("fetches and returns job", async () => {
      const job = { type: "job" } as Job;
      const mockJobSchemaParse = vi.mocked(jobSchema.parse);
      mockJobSchemaParse.mockReturnValue(job);

      const result = await fetchJob(id);
      expect(result).toEqual(job);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockJobSchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });

  describe("fetchPoll", () => {
    it("fetches and returns poll", async () => {
      const poll = { type: "poll" } as Poll;
      const mockPollSchemaParse = vi.mocked(pollSchema.parse);
      mockPollSchemaParse.mockReturnValue(poll);

      const result = await fetchPoll(id);
      expect(result).toEqual(poll);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockPollSchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });

  describe("fetchPollopt", () => {
    it("fetches and returns pollopt", async () => {
      const pollopt = { type: "pollopt" } as Pollopt;
      const mockPolloptSchemaParse = vi.mocked(polloptSchema.parse);
      mockPolloptSchemaParse.mockReturnValue(pollopt);

      const result = await fetchPollopt(id);
      expect(result).toEqual(pollopt);

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(itemUrl);
      expect(mockResponse.json).toHaveBeenCalledOnce();
      expect(mockPolloptSchemaParse).toHaveBeenCalledExactlyOnceWith(json);
    });
  });
});
