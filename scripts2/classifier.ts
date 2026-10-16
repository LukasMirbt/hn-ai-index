import { calculateSlopLocal } from "./feature/calculateSlop.ts";
import * as fs from "node:fs";

await saveSlopForYear(2025);

async function saveSlopForYear(year: number): Promise<void> {
  const startDate = new Temporal.PlainDate(year, 3, 1);

  for (
    let date = startDate;
    date.year === startDate.year;
    date = date.subtract({ months: 1 })
  ) {
    const results = await getSlopForMonth({
      year: startDate.year,
      month: date.month,
    });
    saveMonthResults(results);
  }
}

async function getSlopForMonth({
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
    const start = performance.now();
    const result = await calculateSlopLocal(date);
    const key = date.toString();
    results[key] = result;
    console.log(key, result);
    console.log(
      `[timing] ${key} took ${Math.round(performance.now() - start)}ms in total`,
    );
  }

  return results;
}

function saveMonthResults(monthResults: Record<string, number[]>): void {
  const data = fs.readFileSync("./src/data/slop.json", "utf8");
  const existingResults = JSON.parse(data) as Record<string, number[]>;

  const mergedResults = {
    ...monthResults,
    ...existingResults,
  };

  const mergedJson = JSON.stringify(mergedResults);

  fs.writeFileSync("./src/data/slop.json", mergedJson);
}
