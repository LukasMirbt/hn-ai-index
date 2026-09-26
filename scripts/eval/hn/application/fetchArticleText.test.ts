import { describe, expect, it, vi } from "vitest";
import { fetchArticleText } from "./fetchArticleText.js";
import type { ArticleExtractor, ArticleGateway } from "./ports.js";
import { readArticleExcerpt } from "./readArticleExcerpt.js";

vi.mock("./readArticleExcerpt.js");

const ARTICLE_URL = "https://example.com/article";
const EXCERPT = "article excerpt";
const FAILURE = new Error("failure");

const gateway = {
  fetchHtml: vi.fn<ArticleGateway["fetchHtml"]>(),
} satisfies ArticleGateway;

const extractor = {
  extractText: vi.fn<ArticleExtractor["extractText"]>(),
} satisfies ArticleExtractor;

const readArticleExcerptMock = vi.mocked(readArticleExcerpt);

describe("fetchArticleText", () => {
  it("returns the article excerpt", async () => {
    readArticleExcerptMock.mockResolvedValue(EXCERPT);

    const text = await fetchArticleText(gateway, extractor, ARTICLE_URL);

    expect(readArticleExcerptMock).toHaveBeenCalledWith(
      gateway,
      extractor,
      ARTICLE_URL,
    );
    expect(text).toBe(EXCERPT);
  });

  it("returns null when reading the article excerpt fails", async () => {
    readArticleExcerptMock.mockRejectedValue(FAILURE);

    const text = await fetchArticleText(gateway, extractor, ARTICLE_URL);

    expect(text).toBeNull();
  });
});
