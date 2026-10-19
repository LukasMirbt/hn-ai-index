import { connection, dataGlob } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

export * from "./models/commentRowSchema.ts";
export * from "./models/storyRowSchema.ts";

export async function readStory(id: number): Promise<StoryRow> {
  const reader = await connection.runAndReadAll(`
    WITH RECURSIVE tree(id) AS (
      SELECT ${id}::BIGINT
      UNION
      SELECT item.id
      FROM read_parquet('${dataGlob}') item
      JOIN tree ON item.parent = tree.id
    ),
    latest AS (
      SELECT id, text, deleted, dead
      FROM read_parquet('${dataGlob}')
      WHERE id IN (SELECT id FROM tree) AND id <> ${id}
      QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
    )
    SELECT id, coalesce(text, '') AS text
    FROM latest
    WHERE NOT coalesce(deleted::BOOLEAN, false)
      AND NOT coalesce(dead::BOOLEAN, false)
    ORDER BY id
  `);

  const rows = reader.getRowObjectsJS() as { id: bigint; text: string }[];

  return storyRowSchema.parse({
    id,
    comments: rows.map((row) => ({ id: Number(row.id), htmlText: row.text })),
  });
}
