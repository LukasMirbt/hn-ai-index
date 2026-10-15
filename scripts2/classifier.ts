import { calculateSlopLocal } from "./feature/calculateSlop.ts";
import * as fs from "node:fs";

const startDate = new Temporal.PlainDate(2026, 9, 1);

const results: Record<string, number[]> = {};

for (
  let date = startDate;
  date.month === startDate.month;
  date = date.add({ days: 1 })
) {
  const result = await calculateSlopLocal(date);
  const key = date.toString();
  results[key] = result;
  console.log(key, result);
}

const json = JSON.stringify(results);

fs.writeFileSync("./results.json", json);
