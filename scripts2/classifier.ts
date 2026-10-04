import { fetchFrontPage } from "./domain/hnRepository.ts";
import { detectSlop, type CommentData } from "./webApi/parsers/itemParser.ts";
import { fetchItem } from "./webApi/webApi.ts";

const data = await fetchFrontPage({ date: new Date("2026-10-01") });

const resultItems: {
  id: number;
  commentsWithSlop: CommentData[];
}[] = [];

for await (const item of data.items) {
  const data = await fetchItem(item.id);
  console.log("item comment length", data.comments.length);

  const commentsWithSlop: CommentData[] = [];

  for (const comment of data.comments) {
    const hasSlop = detectSlop(comment.htmlText);

    if (hasSlop) {
      commentsWithSlop.push(comment);
    }
  }

  resultItems.push({
    id: item.id,
    commentsWithSlop,
  });
  console.log("comments with slop length", commentsWithSlop.length);
}

console.log(resultItems);
