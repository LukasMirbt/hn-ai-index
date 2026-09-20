/**
 * Fetches the top 100 HN posts with all signals and writes candidates.json.
 * Copy candidates.json to labeled.json and set label.relevance on each entry.
 *
 * Usage: node_modules/.bin/tsx scripts/eval/fetch-candidates.ts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchTopIds, fetchPost, fetchCommentText, fetchBottomCommentIds, fetchArticleText } from "./hnApi.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOP_POSTS = 100;
const TOP_COMMENTS = 5;
const BOTTOM_COMMENTS = 5;

export interface Candidate {
  id: number;
  title: string;
  url: string | null;
  domain: string | null;
  text: string | null;
  articleText: string | null;
  topComments: string[];
  bottomComments: string[];
  label: { relevance: number } | null;
}

const fetchComments = async (kids: number[], n: number): Promise<string[]> => {
  const texts = await Promise.all(kids.slice(0, n).map(fetchCommentText));
  return texts.filter((t): t is string => t !== null);
};

const toCandidate = async (id: number): Promise<Candidate | null> => {
  const post = await fetchPost(id);
  if (!post) return null;
  const bottomIds = fetchBottomCommentIds(post.kids, BOTTOM_COMMENTS);
  const bottomRaw = await fetchComments(bottomIds, bottomIds.length);
  return {
    ...post,
    articleText: post.url ? await fetchArticleText(post.url) : null,
    topComments: await fetchComments(post.kids, TOP_COMMENTS),
    bottomComments: bottomRaw.slice(0, BOTTOM_COMMENTS),
    label: null,
  };
};

const ids = await fetchTopIds(TOP_POSTS);
console.log(`Fetching ${ids.length} posts...`);

const candidates = (await Promise.all(ids.map(toCandidate)))
  .filter((c): c is Candidate => c !== null);

const out = join(__dirname, "candidates.json");
writeFileSync(out, JSON.stringify(candidates, null, 2));
console.log(`Wrote ${candidates.length} candidates to ${out}`);
