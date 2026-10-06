import {
  fetchFrontPage,
  fetchItem,
  CommentModel,
  type Comment,
} from "../domain/hnRepository.ts";

export type SlopResultItem = {
  id: number;
  commentsWithSlop: Comment[];
};

export type SlopResult = SlopResultItem[];

export async function calculateSlop(date: Date): Promise<SlopResult> {
  const data = await fetchFrontPage(date);

  const resultItems: SlopResultItem[] = [];

  for await (const item of data.items) {
    const data = await fetchItem(item.id);

    const commentsWithSlop = data.comments.filter((item) =>
      CommentModel.hasSlop(item),
    );

    resultItems.push({
      id: item.id,
      commentsWithSlop,
    });
  }

  return resultItems;
}
