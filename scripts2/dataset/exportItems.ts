import { mkdir, readdir, rename, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import type { ReadableStream } from "node:stream/web";
import { baseUrl as firebaseBaseUrl } from "../firebaseApi/firebaseApi.ts";

// Exports the raw hackernews_history table from the public ClickHouse
// Playground into local Parquet files, one file per 500k ids. Rerunning only
// downloads chunks that are missing or were incomplete (the chunk containing
// maxitem).
//
// Usage: npx tsx scripts2/dataset/exportItems.ts

const clickhouseUrl = "https://play.clickhouse.com/?user=play";
const outDir = path.resolve(
  import.meta.dirname,
  "../../data/hackernews_history",
);

// The playground caps results at 1M rows. Ids can have several versions,
// so 500k ids per chunk leaves headroom.
const chunkSize = 500_000;
const maxAttempts = 3;

// Raw dump: hackernews_history keeps a row per item version (update_time),
// so ids can repeat. Deduplicate when querying locally.
function chunkQuery(start: number, end: number): string {
  return `
SELECT *
FROM default.hackernews_history
WHERE id BETWEEN ${start} AND ${end}
ORDER BY id, update_time
FORMAT Parquet`;
}

function chunkFileName(index: number, isComplete: boolean): string {
  const name = `items-${String(index).padStart(3, "0")}`;
  return isComplete ? `${name}.parquet` : `${name}.partial.parquet`;
}

async function fetchMaxItem(): Promise<number> {
  const response = await fetch(`${firebaseBaseUrl}/maxitem.json`);
  if (!response.ok) {
    throw new Error(`maxitem request failed: ${response.status}`);
  }
  return Number(await response.json());
}

async function downloadChunk(
  start: number,
  end: number,
  filePath: string,
): Promise<void> {
  const response = await fetch(clickhouseUrl, {
    method: "POST",
    body: chunkQuery(start, end),
  });

  if (!response.ok || !response.body) {
    throw new Error(`ClickHouse ${response.status}: ${await response.text()}`);
  }

  const tempPath = `${filePath}.tmp`;
  await pipeline(
    Readable.fromWeb(response.body as ReadableStream),
    createWriteStream(tempPath),
  );
  await rename(tempPath, filePath);
}

async function downloadChunkWithRetry(
  start: number,
  end: number,
  filePath: string,
): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await downloadChunk(start, end, filePath);
    } catch (error) {
      if (attempt >= maxAttempts) throw error;
      console.warn(`  attempt ${attempt} failed, retrying:`, error);
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    }
  }
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });

  const maxItem = await fetchMaxItem();
  const chunkCount = Math.floor(maxItem / chunkSize) + 1;
  console.log(`maxitem ${maxItem}, ${chunkCount} chunks -> ${outDir}`);

  const existing = new Set(await readdir(outDir));

  for (let index = 0; index < chunkCount; index++) {
    const start = index * chunkSize;
    const end = start + chunkSize - 1;
    const isComplete = end <= maxItem;
    const fileName = chunkFileName(index, isComplete);

    if (isComplete && existing.has(fileName)) continue;

    const partialName = chunkFileName(index, false);
    console.log(`chunk ${index + 1}/${chunkCount}: ids ${start}-${end}`);
    await downloadChunkWithRetry(start, end, path.join(outDir, fileName));

    if (isComplete && existing.has(partialName)) {
      await rm(path.join(outDir, partialName));
    }
  }

  console.log("done");
}

await main();
