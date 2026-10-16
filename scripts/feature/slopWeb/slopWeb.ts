import { fetchFrontPage, fetchItem } from "../../domain/hnRepository.ts";

export async function calculateSlopWeb(
  date: Temporal.PlainDate,
): Promise<number[]> {
  const data = await fetchFrontPage(date);

  const results: number[] = [];

  for await (const item of data.items) {
    const data = await fetchItem(item.id);
    const commentsWithSlop = data.commentsWithSlop;
    results.push(commentsWithSlop.length);
  }

  return results;
}
