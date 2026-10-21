import * as repository from "../../domain/hnRepository.ts";

export async function calculateSlopLocal(
  date: Temporal.PlainDate,
): Promise<void> {
  const page = await repository.saveSlop(date);
  const ids = page.items.map((item) => item.id);
  const items = await repository.readItems(ids);
  return items.map((item) => item.commentsWithSlop.length);
}
