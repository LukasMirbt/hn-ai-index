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
    WITH RECURSIVE t(n) AS (
      VALUES (1)
        UNION
      SELECT n+1 FROM t WHERE n < 100
    )
    SELECT sum(n) FROM t;
  `);

  return reader.getRowObjectsJS();

  /*   const rows = reader.getRowObjectsJS() as { id: bigint; text: string }[];

  return storyRowSchema.parse({
    id,
    comments: rows.map((row) => ({ id: Number(row.id), htmlText: row.text })),
  }); */
}
