import { fetchFrontPage, fetchItem } from "../domain/hnRepository.ts";

export async function calculateSlop(date: Date): Promise<number[]> {
  const data = await fetchFrontPage(date);

  const results = await Promise.all(
    data.items.map((item) => fetchItem(item.id)),
  );

  return results.map((item) => item.commentsWithSlop.length);
}
