/**
 * Fetches an HN post by ID and appends it to testCases.json with your labels.
 *
 * Usage:
 *   node_modules/.bin/tsx scripts/eval/addTestCase.ts <hnPostId> <relevance>
 *
 *   relevance:  0.0 (not about AI) to 1.0 (entirely about AI)
 *
 * Examples:
 *   node_modules/.bin/tsx scripts/eval/addTestCase.ts 40423541 1.0
 *   node_modules/.bin/tsx scripts/eval/addTestCase.ts 39578940 0.0
 *   node_modules/.bin/tsx scripts/eval/addTestCase.ts 39592781 0.5
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchPost, fetchCommentText, fetchBottomCommentIds, fetchArticleText } from "./hnApi.js";
import type { Candidate } from "./fetchCandidates.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_CASES_PATH = join(__dirname, "testCases.json");

const [idArg, relevanceArg] = process.argv.slice(2);
const relevance = Number(relevanceArg);

const validRelevance = !isNaN(relevance) && relevance >= 0 && relevance <= 1;

if (!idArg || !validRelevance) {
  console.error("Usage: tsx scripts/eval/addTestCase.ts <hnPostId> <relevance>");
  console.error("  relevance:  0.0–1.0   (how much is this post about AI?)");
  process.exit(1);
}

const id = Number(idArg);
if (!Number.isInteger(id) || id <= 0) {
  console.error(`Invalid HN post ID: ${idArg}`);
  process.exit(1);
}

console.log(`Fetching HN post ${id}...`);
const post = await fetchPost(id);
if (!post) {
  console.error(`Could not fetch post ${id} (deleted, dead, or not found).`);
  process.exit(1);
}

const topCommentTexts = await Promise.all(post.kids.slice(0, 5).map(fetchCommentText));
const topComments = topCommentTexts.filter((c): c is string => c !== null);

const bottomIds = fetchBottomCommentIds(post.kids, 5);
const bottomCommentTexts = await Promise.all(bottomIds.map(fetchCommentText));
const bottomComments = bottomCommentTexts.filter((c): c is string => c !== null).slice(0, 5);

const articleText = post.url ? await fetchArticleText(post.url) : null;

const entry: Candidate = {
  id: post.id,
  title: post.title,
  url: post.url,
  domain: post.domain,
  text: post.text,
  articleText,
  topComments,
  bottomComments,
  label: { relevance },
};

const existing: Candidate[] = JSON.parse(readFileSync(TEST_CASES_PATH, "utf-8"));

if (existing.some((c) => c.id === id)) {
  console.error(`Post ${id} already exists in testCases.json.`);
  process.exit(1);
}

existing.push(entry);
writeFileSync(TEST_CASES_PATH, JSON.stringify(existing, null, 2) + "\n");

console.log(`\nAdded [relevance=${relevance}]: ${post.title}`);
if (post.url) console.log(`  URL: ${post.url}`);
console.log(`  Total test cases: ${existing.length}`);
