import type { HnPost } from "./hn/domain/hnPost.js";
import { fetchTopIds as fetchTopIdsUseCase } from "./hn/application/fetchTopIds.js";
import { fetchCommentText as fetchCommentTextUseCase } from "./hn/application/fetchCommentText.js";
import { fetchArticleText as fetchArticleTextUseCase } from "./hn/application/fetchArticleText.js";
import { firebaseHnGateway } from "./hn/infrastructure/firebaseHnGateway.js";
import { httpArticleGateway } from "./hn/infrastructure/httpArticleGateway.js";
import { readabilityArticleExtractor } from "./hn/infrastructure/readabilityArticleExtractor.js";

export type { HnPost };
export { selectBottomCommentIds as fetchBottomCommentIds } from "./hn/domain/bottomCommentIds.js";

export const fetchTopIds = (count: number): Promise<number[]> =>
  fetchTopIdsUseCase(firebaseHnGateway, count);

export const fetchPost = (id: number): Promise<HnPost | null> =>
  firebaseHnGateway.fetchPost(id);

export const fetchCommentText = (id: number): Promise<string | null> =>
  fetchCommentTextUseCase(firebaseHnGateway, id);

export const fetchArticleText = (url: string): Promise<string | null> =>
  fetchArticleTextUseCase(httpArticleGateway, readabilityArticleExtractor, url);
