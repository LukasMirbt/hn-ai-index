import type { Classifier, Classification, Post } from "./classifier.js";

const AI_DOMAINS = new Set([
  "openai.com", "anthropic.com", "deepmind.com", "huggingface.co",
  "mistral.ai", "cohere.com", "groq.com", "perplexity.ai",
  "together.ai", "replicate.com", "stability.ai", "arxiv.org",
]);

const AI_PATTERNS = [
  /\bgpt\b/i, /claude/i, /gemini/i, /llama/i, /mistral/i,
  /openai/i, /anthropic/i, /deepseek/i,
  /\bllm\b/i, /large language model/i, /\bai\b/i,
  /machine learning/i, /deep learning/i, /neural network/i,
  /\brag\b/i, /retrieval.augmented/i, /embedding/i, /fine.?tun/i,
  /agentic/i, /\bagent\b/i, /chatbot/i, /copilot/i,
  /chatgpt/i, /stable diffusion/i, /vibe coding/i,
];

const matches = (text: string) => AI_PATTERNS.some((re) => re.test(text));
const commentHits = (comments: string[]) => comments.filter(matches).length;

const relevanceScore = (post: Post): { relevance: number; reason: string } => {
  if (post.domain && AI_DOMAINS.has(post.domain))
    return { relevance: 1.0, reason: `domain:${post.domain}` };
  if (matches(post.title))
    return { relevance: 1.0, reason: "title" };
  if (post.text && matches(post.text))
    return { relevance: 0.8, reason: "text" };
  const hits = commentHits(post.topComments);
  if (hits >= 3) return { relevance: 0.6, reason: `comments:${hits}` };
  if (hits >= 1) return { relevance: 0.3, reason: `comments:${hits}` };
  return { relevance: 0.0, reason: "no_match" };
};

// Keyword classifier cannot determine sentiment — returns 0.0 (neutral) always.
// A future LLM-based classifier should produce meaningful sentiment scores.
export const KeywordClassifier: Classifier = {
  name: "KeywordClassifier",
  classify(post: Post): Classification {
    const { relevance, reason } = relevanceScore(post);
    return { relevance, sentiment: 0.0, reason };
  },
};
