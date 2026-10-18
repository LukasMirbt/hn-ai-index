import * as client from "../fileStorageClient/fileStorageClient.ts";
import { z } from "zod";
import { type Storage, storageSchema } from "./models/storage.ts";
import * as PathModel from "./models/path.ts";

export function checkIfExists(date: Temporal.PlainDate): boolean {
  const path = PathModel.from(date, { error: false });
  const exists = client.checkIfExists(path);
  return exists;
}

export function save({
  date,
  html,
  error,
}: {
  date: Temporal.PlainDate;
  html: string;
  error: boolean;
}): void {
  const path = PathModel.from(date, { error });

  client.write({
    path,
    data: html,
  });
}
