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
 * Key question for relevance: to what degree would a reader following AI
 *   news be better informed about AI after reading this post?
 */

export interface Post {
  id: number;
  title: string;
  domain: string | null;
  text: string | null;
  articleText?: string | null;
  topComments: string[];
  bottomComments?: string[];
}

export interface Classification {
  relevance: number; // 0.0–1.0
  reason: string;
}

export interface Classifier {
  name: string;
  classify(post: Post): Classification | Promise<Classification>;
}
