import * as repository from "../../domain/hnRepository.ts";

export async function calculateSlopLocal(
  date: Temporal.PlainDate,
): Promise<number[]> {
  const page = await repository.readFrontPage(date);
  const ids = page.items.map((item) => item.id);
  const items = await repository.readItems(ids);
  return items.map((item) => item.commentsWithSlop.length);
}
