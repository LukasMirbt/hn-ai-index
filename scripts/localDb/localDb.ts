import { connection, dataGlob } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

export * from "./models/commentRowSchema.ts";
export * from "./models/storyRowSchema.ts";

export async function readStory(id: number): Promise<StoryRow> {
  /* WITH RECURSIVE 
  SELECT id, deleted, dead, kids
  FROM read_parquet('${dataGlob}')
  WHERE id = 20003863; */

  const reader = await connection.runAndReadAll(`
    WITH RECURSIVE story AS (
      SELECT id, kids, dead, deleted
      FROM read_parquet('${dataGlob}')
      WHERE id = ${id}
        UNION
      SELECT id, kids, dead, deleted
      FROM read_parquet('${dataGlob}')
      WHERE id IN (
        SELECT unnest(kids) FROM story
      )
    )
    SELECT id 
    FROM story
    WHERE dead = 0
    AND deleted = 0
    AND id != ${id};
  `);

  return reader.getRowObjectsJS().map((item) => item.id);

  /*   const rows = reader.getRowObjectsJS() as { id: bigint; text: string }[];

  return storyRowSchema.parse({
    id,
    comments: rows.map((row) => ({ id: Number(row.id), htmlText: row.text })),
  }); */
}
