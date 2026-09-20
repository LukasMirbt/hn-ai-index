import { parseDocument } from "htmlparser2";
import { isTag } from "domhandler";
import { selectAll } from "css-select";
import { fetchPost, fetchArticleText, fetchCommentText, fetchBottomCommentIds } from "./eval/hnApi.js";
import { LlmClassifier } from "./eval/LlmClassifier.js";

const date = new Date();
date.setDate(date.getDate() - 1);
const dateStr = date.toISOString().slice(0, 10);

console.log(`Fetching front page for ${dateStr}...`);
const res = await fetch(`https://news.ycombinator.com/front?day=${dateStr}`, {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; hn-ai-index/1.0)" },
});
const html = await res.text();
const doc = parseDocument(html);
const anchors = selectAll("a[href]", doc.children).filter(isTag);

const ids = new Set<number>();
for (const a of anchors) {
  const match = a.attribs.href?.match(/^(?:https?:\/\/news\.ycombinator\.com\/)?item\?id=(\d+)$/);
  if (match) ids.add(Number(match[1]));
  if (ids.size >= 3) break;
}

console.log(`Found IDs: ${[...ids].join(", ")}`);

for (const id of ids) {
  const post = await fetchPost(id);
  if (!post) { console.log(`[${id}] skipped`); continue; }
  const topComments = (await Promise.all(post.kids.slice(0, 3).map(fetchCommentText))).filter(Boolean) as string[];
  const bottomIds = fetchBottomCommentIds(post.kids, 3);
  const bottomComments = (await Promise.all(bottomIds.map(fetchCommentText))).filter(Boolean) as string[];
  const articleText = post.url ? await fetchArticleText(post.url) : null;

  const { relevance } = await LlmClassifier.classify({ ...post, topComments, bottomComments, articleText });
  console.log(`[${id}] relevance=${relevance.toFixed(2)} — ${post.title}`);
}
