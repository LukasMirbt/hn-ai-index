import type { HnPost } from "../domain/hnPost.js";
import { domainOf } from "../shared/domainOf.js";
import { optionalHtmlToPlainText } from "../shared/plainText.js";
import type { HnStory } from "./hnItem.js";

export const toPost = (story: HnStory): HnPost => {
  const url = story.url ?? null;
  const domain = domainOf(story.url);
  const text = optionalHtmlToPlainText(story.text);
  const kids = story.kids ?? [];
  return { id: story.id, title: story.title, url, domain, text, kids };
};
