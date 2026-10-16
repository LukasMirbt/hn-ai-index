import { fetchFrontPage, fetchItems } from "../../domain/hnRepository.ts";

export async function calculateSlopLocal(
  date: Temporal.PlainDate,
): Promise<number[]> {
  const page = await fetchFrontPage(date);
  const ids = page.items.map((item) => item.id);
  const items = await fetchItems(ids);
  return items.map((item) => item.commentsWithSlop.length);
}
