import { beforeEach, describe, expect, it, vi } from "vitest";
import { toArticleExcerpt } from "../domain/articleExcerpt.js";
import type { ArticleExtractor, ArticleGateway } from "./ports.js";
import { readArticleExcerpt } from "./readArticleExcerpt.js";

vi.mock("../domain/articleExcerpt.js");

const ARTICLE_URL = "https://example.com/article";
const ARTICLE_HTML = "<article>article html</article>";
const ARTICLE_TEXT = "article text";
const EXCERPT = "article excerpt";

const gateway = {
  fetchHtml: vi.fn<ArticleGateway["fetchHtml"]>(),
} satisfies ArticleGateway;

const extractor = {
  extractText: vi.fn<ArticleExtractor["extractText"]>(),
} satisfies ArticleExtractor;

const toArticleExcerptMock = vi.mocked(toArticleExcerpt);

const readExcerpt = () => readArticleExcerpt(gateway, extractor, ARTICLE_URL);

beforeEach(() => {
  vi.resetAllMocks();
  gateway.fetchHtml.mockResolvedValue(ARTICLE_HTML);
  extractor.extractText.mockReturnValue(ARTICLE_TEXT);
  toArticleExcerptMock.mockReturnValue(EXCERPT);
});

describe("readArticleExcerpt", () => {
  it("returns null when no html is fetched", async () => {
    gateway.fetchHtml.mockResolvedValue(null);

    const excerpt = await readExcerpt();

    expect(excerpt).toBeNull();
  });

  it("returns null when no text is extracted", async () => {
    extractor.extractText.mockReturnValue(null);

    const excerpt = await readExcerpt();

    expect(excerpt).toBeNull();
  });

  it("returns the excerpt of the article text", async () => {
    const excerpt = await readExcerpt();

    expect(gateway.fetchHtml).toHaveBeenCalledWith(ARTICLE_URL);
    expect(extractor.extractText).toHaveBeenCalledWith(
      ARTICLE_HTML,
      ARTICLE_URL,
    );
    expect(toArticleExcerptMock).toHaveBeenCalledWith(ARTICLE_TEXT);
    expect(excerpt).toBe(EXCERPT);
  });
});
