import * as repository from "../../domain/hnRepository.ts";
import { setTimeout } from "node:timers/promises";

export async function saveFrontPagesForYear(year: number): Promise<void> {
  const startDate = new Temporal.PlainDate(year, 9, 1);

  for (
    let date = startDate;
    date.year === startDate.year;
    date = date.subtract({ months: 1 })
  ) {
    await saveFrontPagesForMonth({
      year: startDate.year,
      month: date.month,
    });
  }
}

async function saveFrontPagesForMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<void> {
  const startDate = new Temporal.PlainDate(year, month, 1);

  for (
    let date = startDate;
    date.month === startDate.month;
    date = date.add({ days: 1 })
  ) {
    const isCached = repository.checkIsFrontPageCached(date);

    if (isCached) {
      console.log("cached", date.toString());
      continue;
    }

    await repository.saveFrontPage(date);

    console.log(date.toString(), "saved");

    await setTimeout(1000);
  }
}
