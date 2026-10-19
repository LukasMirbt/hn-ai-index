import { calculateSlopLocal } from "./slopLocal/slopLocal.ts";

export async function calculateSlopForYear(year: number): Promise<void> {
  const startDate = new Temporal.PlainDate(year, 12, 1);

  for (
    let date = startDate;
    date.year === startDate.year;
    date = date.subtract({ months: 1 })
  ) {
    await calculateSlopForMonth({
      year: startDate.year,
      month: date.month,
    });
  }
}

async function calculateSlopForMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<Record<string, number[]>> {
  const startDate = new Temporal.PlainDate(year, month, 1);

  const results: Record<string, number[]> = {};

  for (
    let date = startDate;
    date.month === startDate.month;
    date = date.add({ days: 1 })
  ) {
    await calculateSlopLocal(date);
  }

  return results;
}
