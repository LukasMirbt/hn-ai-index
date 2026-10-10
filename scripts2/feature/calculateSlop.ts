import {
  fetchFrontPage,
  fetchItem,
  fetchItems,
} from "../domain/hnRepository.ts";

export async function calculateSlopLocal(date: Date): Promise<number[]> {
  const page = await fetchFrontPage(date);
  const ids = page.items.map((item) => item.id);
  const items = await fetchItems(ids);
  return items.map((item) => item.commentsWithSlop.length);
}

export async function calculateSlopWeb(date: Date): Promise<number[]> {
  const data = await fetchFrontPage(date);

  const results: number[] = [];

  for await (const item of data.items) {
    const data = await fetchItem(item.id);
    const commentsWithSlop = data.commentsWithSlop;
    results.push(commentsWithSlop.length);
  }

  return results;
}
