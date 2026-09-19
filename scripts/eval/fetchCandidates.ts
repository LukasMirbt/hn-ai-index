/**
 * Fetches the top 100 HN posts with all signals and writes candidates.json.
 * Copy candidates.json to labeled.json and set label: true/false on each entry.
 *
 * Usage: node_modules/.bin/tsx scripts/eval/fetch-candidates.ts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchTopIds, fetchPost, fetchCommentText } from "./hnApi.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOP_POSTS = 100;
const TOP_COMMENTS = 5;

export interface Candidate {
  id: number;
  title: string;
  url: string | null;
  domain: string | null;
  text: string | null;
  topComments: string[];
  label: boolean | null;
}

const fetchComments = async (kids: number[]): Promise<string[]> => {
  const texts = await Promise.all(kids.slice(0, TOP_COMMENTS).map(fetchCommentText));
  return texts.filter((t): t is string => t !== null);
};

const toCandidate = async (id: number): Promise<Candidate | null> => {
  const post = await fetchPost(id);
  if (!post) return null;
  return { ...post, topComments: await fetchComments(post.kids), label: null };
};

const ids = await fetchTopIds(TOP_POSTS);
console.log(`Fetching ${ids.length} posts...`);

const candidates = (await Promise.all(ids.map(toCandidate)))
  .filter((c): c is Candidate => c !== null);

const out = join(__dirname, "candidates.json");
writeFileSync(out, JSON.stringify(candidates, null, 2));
console.log(`Wrote ${candidates.length} candidates to ${out}`);
