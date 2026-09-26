import type { HnPost } from "../domain/hnPost.js";

export interface HnGateway {
  fetchTopStoryIds(): Promise<number[]>;
  fetchPost(id: number): Promise<HnPost | null>;
  fetchCommentHtml(id: number): Promise<string | null>;
}

export interface ArticleGateway {
  fetchHtml(url: string): Promise<string | null>;
}

export interface ArticleExtractor {
  extractText(html: string, url: string): string | null;
}
