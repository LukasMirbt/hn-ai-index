/**
 * Collects AI relevance scores for the top 30 HN front page posts
 * for each of the past 14 days and writes src/data/relevance.json.
 *
 * Requires Ollama to be running: `ollama serve`
 * Usage: node_modules/.bin/tsx scripts/collect.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseDocument } from "htmlparser2";
import { selectAll } from "css-select";
import {
  fetchPost,
  fetchCommentText,
  fetchBottomCommentIds,
  fetchArticleText,
} from "./eval/hnApi.js";
import { LlmClassifier } from "./eval/LlmClassifier.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const TOP_COMMENTS = 5;
const BOTTOM_COMMENTS = 5;
const DAYS_BACK = 14;
const POSTS_PER_DAY = 30;

// ── Date helpers ─────────────────────────────────────────────────────────────

function dateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// ── HN front page scraper ────────────────────────────────────────────────────

async function fetchFrontPageIds(date: string): Promise<number[]> {
  const url = `https://news.ycombinator.com/front?day=${date}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; hn-ai-index/1.0)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();

  const doc = parseDocument(html);
  const anchors = selectAll("a[href]", doc) as unknown as Array<{ attribs: { href: string } }>;

  const ids = new Set<number>();
  for (const a of anchors) {
    const match = a.attribs.href?.match(/^(?:https?:\/\/news\.ycombinator\.com\/)?item\?id=(\d+)$/);
    if (match) ids.add(Number(match[1]));
    if (ids.size >= POSTS_PER_DAY) break;
  }
  return [...ids];
}

// ── Per-post data fetcher ────────────────────────────────────────────────────

async function fetchComments(kids: number[], n: number): Promise<string[]> {
  const texts = await Promise.all(kids.slice(0, n).map(fetchCommentText));
  return texts.filter((t): t is string => t !== null);
}

async function enrichPost(id: number) {
  const post = await fetchPost(id);
  if (!post) return null;

  const [topComments, articleText] = await Promise.all([
    fetchComments(post.kids, TOP_COMMENTS),
    post.url ? fetchArticleText(post.url) : Promise.resolve(null),
  ]);

  const bottomIds = fetchBottomCommentIds(post.kids, BOTTOM_COMMENTS);
  const bottomRaw = await Promise.all(bottomIds.map(fetchCommentText));
  const bottomComments = bottomRaw.filter((t): t is string => t !== null).slice(0, BOTTOM_COMMENTS);

  return { ...post, articleText, topComments, bottomComments };
}

// ── Main ─────────────────────────────────────────────────────────────────────

export interface DayResult {
  date: string;
  posts: Array<{ id: number; title: string; domain: string | null; relevance: number }>;
}

const results: DayResult[] = [];

for (let daysAgo = DAYS_BACK; daysAgo >= 1; daysAgo--) {
  const date = dateString(daysAgo);
  console.log(`\n── ${date} ──`);

  let ids: number[];
  try {
    ids = await fetchFrontPageIds(date);
  } catch (e) {
    console.error(`  Failed to fetch front page: ${e}`);
    continue;
  }
  console.log(`  ${ids.length} post IDs found`);

  const dayPosts: DayResult["posts"] = [];

  for (const id of ids) {
    const post = await enrichPost(id);
    if (!post) { console.log(`  [${id}] skipped (deleted/dead)`); continue; }

    const { relevance } = await LlmClassifier.classify(post);
    console.log(`  [${id}] ${relevance.toFixed(2)} ${post.title}`);

    dayPosts.push({ id: post.id, title: post.title, domain: post.domain, relevance });
  }

  results.push({ date, posts: dayPosts });
}

const outDir = join(__dirname, "../src/data");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "relevance.json");
writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");
console.log(`\nWrote ${results.length} days to ${outPath}`);
