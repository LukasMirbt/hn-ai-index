import { describe, expect, it, vi } from "vitest";
import { collapseWhitespace } from "../shared/plainText.js";
import { toArticleExcerpt } from "./articleExcerpt.js";

vi.mock("../shared/plainText.js");

const ARTICLE_TEXT = "article   text";
const EXCERPT_MAX_LENGTH = 1500;
const EXCERPT = "a".repeat(EXCERPT_MAX_LENGTH);
const COLLAPSED_TEXT = `${EXCERPT}b`;

const collapseWhitespaceMock = vi.mocked(collapseWhitespace);

describe("toArticleExcerpt", () => {
  it("returns the collapsed text truncated to the max length", () => {
    collapseWhitespaceMock.mockReturnValue(COLLAPSED_TEXT);

    const excerpt = toArticleExcerpt(ARTICLE_TEXT);

    expect(collapseWhitespaceMock).toHaveBeenCalledWith(ARTICLE_TEXT);
    expect(excerpt).toBe(EXCERPT);
  });
});
