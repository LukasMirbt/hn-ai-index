import path from "node:path";
import { client } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

export * from "./models/commentRowSchema.ts";
export * from "./models/storyRowSchema.ts";

export const dataGlob = path.resolve(
  import.meta.dirname,
  "../../data/hackernews_history/*.parquet",
);

export async function fetchStories(storyIds: number[]): Promise<StoryRow[]> {
  if (storyIds.length === 0) return [];

  const ids = storyIds.map((id) => Math.trunc(id));
  const idList = `[${ids.join(", ")}]`;
  const minId = Math.min(...ids);

  const result = await client.runAndReadAll(`
    WITH RECURSIVE
    items AS MATERIALIZED (
      SELECT id, parent, text, deleted, dead
      FROM read_parquet('${dataGlob}')
      WHERE id > ${minId}
      QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
    ),
    thread AS (
      SELECT id, parent AS story_id
      FROM items
      WHERE list_contains(${idList}, parent)
      UNION ALL
      SELECT items.id, thread.story_id
      FROM items
      JOIN thread ON items.parent = thread.id
    ),
    comments AS (
      SELECT thread.story_id, items.id, coalesce(items.text, '') AS html_text
      FROM thread
      JOIN items USING (id)
      WHERE coalesce(items.deleted, 0) = 0 AND coalesce(items.dead, 0) = 0
    ),
    stories AS (
      SELECT unnest(${idList}) AS id, generate_subscripts(${idList}, 1) AS position
    )
    SELECT
      CAST(stories.id AS INTEGER) AS id,
      coalesce(
        list({'id': CAST(comments.id AS INTEGER), 'htmlText': comments.html_text}
          ORDER BY comments.id) FILTER (WHERE comments.id IS NOT NULL),
        []
      ) AS comments
    FROM stories
    LEFT JOIN comments ON comments.story_id = stories.id
    GROUP BY stories.id, stories.position
    ORDER BY stories.position
  `);

  const rows = result.getRowObjectsJS();
  const stories = rows.map((row) => storyRowSchema.parse(row));
  return stories;
}
