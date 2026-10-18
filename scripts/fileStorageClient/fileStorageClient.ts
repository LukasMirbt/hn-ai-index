import * as fs from "node:fs";

export function readJson(path: string): Record<string, unknown> {
  const data = fs.readFileSync(path, "utf8");
  const json = JSON.parse(data) as Record<string, unknown>;
  return json;
}

export function writeJson({
  path,
  data,
}: {
  path: string;
  data: Record<string, unknown>;
}): void {
  const json = JSON.stringify(data);
  fs.writeFileSync(path, json);
}
