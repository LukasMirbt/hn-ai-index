/**
 * Classification criteria
 * ────────────────────────
 * The index measures how top-of-mind AI/ML topics are in the HN community,
 * and what the overall sentiment toward AI is — across post and comments combined.
 *
 * relevance: 0.0–1.0
 *   How much is this post about AI/ML?
 *   0.0 = AI not present or mentioned only in passing
 *   1.0 = post is entirely about AI/ML
 *
 * sentiment: -1.0–1.0
 *   What is the combined tone of the post and comment section toward AI?
 *   -1.0 = strongly negative / critical / fearful
 *    0.0 = neutral or mixed
 *   +1.0 = strongly positive / optimistic / enthusiastic
 *
 * Key question for relevance: to what degree would a reader following AI
 *   news be better informed about AI after reading this post?
 *
 * Key question for sentiment: does the post and its discussion treat AI
 *   as a good thing, a bad thing, or neither?
 */

export interface Post {
  id: number;
  title: string;
  domain: string | null;
  text: string | null;
  topComments: string[];
}

export interface Classification {
  relevance: number;  // 0.0–1.0
  sentiment: number;  // -1.0–1.0
  reason: string;
}

export interface Classifier {
  name: string;
  classify(post: Post): Classification;
}
