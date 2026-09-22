/**
 * LlmClassifier — calls a local Ollama instance (qwen2.5:7b) to score
 * AI/ML relevance for a post based on its subject matter only.
 *
 * Requires Ollama to be running: `ollama serve`
 * Model must be pulled: `ollama pull qwen2.5:7b`
 */
import type { Post, Classification } from "./classifier.js";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5:7b";

const SYSTEM_PROMPT = `You are a relevance classifier for Hacker News posts.

Rate how central AI is to the subject of the post, on a continuous scale from 0.0 to 1.0.
The title is the strongest signal. Comments provide supporting context.

AI includes: large language models, generative AI, neural networks, foundation models, reinforcement learning, computer vision, AI agents, AI products and companies, and the broader cultural and economic impact of AI.

Respond with ONLY a single decimal number between 0.0 and 1.0, nothing else.`;

function buildUserPrompt(post: Post): string {
  const parts: string[] = [];
  parts.push(`Title: ${post.title}`);
  if (post.domain) parts.push(`Domain: ${post.domain}`);
  if (post.text) parts.push(`Post text: ${post.text.slice(0, 500)}`);
  if (post.articleText)
    parts.push(`Article excerpt: ${post.articleText.slice(0, 1000)}`);

  if (post.topComments && post.topComments.length > 0) {
    parts.push(
      `Top comments:\n${post.topComments.map((c, i) => `  ${i + 1}. ${c.slice(0, 200)}`).join("\n")}`,
    );
  }
  if (post.bottomComments && post.bottomComments.length > 0) {
    parts.push(
      `Bottom comments:\n${post.bottomComments.map((c, i) => `  ${i + 1}. ${c.slice(0, 200)}`).join("\n")}`,
    );
  }

  return parts.join("\n\n");
}

async function classifyAsync(post: Post): Promise<Classification> {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      system: SYSTEM_PROMPT,
      prompt: buildUserPrompt(post),
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Ollama request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as { response: string };
  const raw = data.response.trim();

  // Parse the first float found in the response
  const match = raw.match(/\d+\.?\d*/);
  const relevance = match
    ? Math.min(1, Math.max(0, parseFloat(match[0])))
    : 0.5;

  return {
    relevance,
    reason: `llm:${raw.slice(0, 20)}`,
  };
}

export const LlmClassifier = {
  name: "LlmClassifier (qwen2.5:7b)",
  classify: classifyAsync,
};
