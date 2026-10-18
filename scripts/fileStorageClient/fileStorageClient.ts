import * as fs from "node:fs";
import { dirname } from "node:path";

export function checkIfExists(path: string): boolean {
  const exists = fs.existsSync(path);
  return exists;
}

export function read(path: string): string {
  const data = fs.readFileSync(path, "utf8");
  return data;
}

export function write({ path, data }: { path: string; data: string }): void {
  const directory = dirname(path);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path, data);
}
