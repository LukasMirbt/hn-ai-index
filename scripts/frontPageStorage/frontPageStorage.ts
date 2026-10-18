import * as client from "../fileStorageClient/fileStorageClient.ts";
import { z } from "zod";
import type { FrontPageData } from "./models/frontPageData.ts";
import { type Storage, storageSchema } from "./models/storage.ts";
import * as cache from "./frontPageStorageCache.ts";
import { path } from "./models/path.ts";

export * from "./models/frontPageData.ts";

export function read(date: Temporal.PlainDate): FrontPageData | null {
  const existing = cache.get();
  const dateString = date.toString();

  const isCached = dateString in existing;
  if (!isCached) return null;

  const data = existing[dateString];
  return data;
}

export function save({
  date,
  page,
}: {
  date: Temporal.PlainDate;
  page: FrontPageData;
}): void {
  const existing = cache.get();
  const dateString = date.toString();

  const merged = {
    ...existing,
    [dateString]: page,
  };

  client.writeJson({
    path,
    data: merged,
  });

  cache.put(merged);
}
