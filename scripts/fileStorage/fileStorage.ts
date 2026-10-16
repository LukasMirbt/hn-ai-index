import * as fs from "node:fs";

export function saveMonthResults(monthResults: Record<string, number[]>): void {
  const data = fs.readFileSync("./src/data/slop.json", "utf8");
  const existingResults = JSON.parse(data) as Record<string, number[]>;

  const mergedResults = {
    ...monthResults,
    ...existingResults,
  };

  const mergedJson = JSON.stringify(mergedResults);

  fs.writeFileSync("./src/data/slop.json", mergedJson);
}
