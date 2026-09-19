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

const MIN_COMMENT_HITS = 2;

const matches = (text: string) => AI_PATTERNS.some((re) => re.test(text));

const commentHits = (comments: string[]) => comments.filter(matches).length;

export const KeywordClassifier: Classifier = {
  name: "KeywordClassifier",
  classify(post: Post): Classification {
    if (post.domain && AI_DOMAINS.has(post.domain))
      return { result: true, reason: `domain:${post.domain}` };
    if (matches(post.title))
      return { result: true, reason: "title" };
    if (post.text && matches(post.text))
      return { result: true, reason: "text" };
    if (commentHits(post.topComments) >= MIN_COMMENT_HITS)
      return { result: true, reason: "comments" };
    return { result: false, reason: "no_match" };
  },
};
