import { describe, expect, it, vi } from "vitest";
import { optionalHtmlToPlainText } from "../shared/plainText.js";
import { fetchCommentText } from "./fetchCommentText.js";
import type { HnGateway } from "./ports.js";

vi.mock("../shared/plainText.js");

const COMMENT_ID = 7;
const COMMENT_HTML = "<p>comment html</p>";
const COMMENT_PLAIN_TEXT = "comment plain text";

const hn = {
  fetchTopStoryIds: vi.fn<HnGateway["fetchTopStoryIds"]>(),
  fetchPost: vi.fn<HnGateway["fetchPost"]>(),
  fetchCommentHtml: vi.fn<HnGateway["fetchCommentHtml"]>(),
} satisfies HnGateway;

const optionalHtmlToPlainTextMock = vi.mocked(optionalHtmlToPlainText);

describe("fetchCommentText", () => {
  it("returns the plain text of the comment", async () => {
    hn.fetchCommentHtml.mockResolvedValue(COMMENT_HTML);
    optionalHtmlToPlainTextMock.mockReturnValue(COMMENT_PLAIN_TEXT);

    const text = await fetchCommentText(hn, COMMENT_ID);

    expect(hn.fetchCommentHtml).toHaveBeenCalledWith(COMMENT_ID);
    expect(optionalHtmlToPlainTextMock).toHaveBeenCalledWith(COMMENT_HTML);
    expect(text).toBe(COMMENT_PLAIN_TEXT);
  });
});
