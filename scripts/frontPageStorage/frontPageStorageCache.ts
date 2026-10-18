import * as client from "../fileStorageClient/fileStorageClient.ts";
import { z } from "zod";
import type { FrontPageData } from "./models/frontPageData.ts";
import { type Storage, storageSchema } from "./models/storage.ts";
import { path } from "./models/path.ts";

let cache: Storage | null = null;

export function get(): Storage {
  if (cache) return cache;

  const existingJson = client.readJson(path);
  const existing = storageSchema.parse(existingJson);

  cache = existing;

  return cache;
}

export function put(storage: Storage): void {
  cache = storage;
}
