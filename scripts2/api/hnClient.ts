import { itemSchema } from "./models/itemSchema.ts";

export const baseUrl = "https://hacker-news.firebaseio.com/v0";

export async function fetchItem(id: number) {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const item = itemSchema.parse(json);
  return item;
}

export async function fetchComment(id: number) {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const item = itemSchema.parse(json);
  return item;
}
