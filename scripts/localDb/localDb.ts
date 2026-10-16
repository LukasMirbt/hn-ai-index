import path from "node:path";
import { client } from "../localDbClient/client.ts";
import { storyRowSchema, type StoryRow } from "./models/storyRowSchema.ts";

export * from "./models/commentRowSchema.ts";
export * from "./models/storyRowSchema.ts";

export const dataGlob = path.resolve(
  import.meta.dirname,
  "../../data/hackernews_history/*.parquet",
);

export async function readStory(id: number): Promise<StoryRow> {
  const reader = await client.runAndReadAll(`
    SELECT id, parent, text, deleted, dead, kids
    FROM read_parquet('${dataGlob}')
    WHERE id = ${id}
  `);

  const results = reader.getRowObjectsJS();
  const story = results[0];
  const kids = story.kids as number[];

  if (kids.length === 0) {
    return {
      id,
      comments: [],
    };
  }

  const comments: StoryRow["comments"] = [];

  async function collectKidsCommentsRecursively(kids: number[]) {
    const reader = await client.runAndReadAll(`
    SELECT id, parent, text, deleted, dead, kids
    FROM read_parquet('${dataGlob}')
    WHERE id IN (${kids.join(",")})
  `);

    const results = reader.getRowObjectsJS() as {
      dead: boolean;
      deleted: boolean;
      id: number;
      text: string;
      kids: number[];
    }[];

    await Promise.all(
      results.map(async (kid) => {
        comments.push({
          id: kid.id,
          htmlText: kid.text,
        });

        if (kid.kids.length !== 0) {
          await collectKidsCommentsRecursively(kid.kids);
        }
      }),
    );
  }

  await collectKidsCommentsRecursively(kids);

  return {
    id,
    comments,
  };
}

type ItemRow = {
  id: number;
  text: string | null;
  deleted: number | null;
  dead: number | null;
  kids: number[] | null;
};

let itemsLoaded: Promise<unknown> | undefined;

// Loads the latest version of every item into an in-memory table once, so the
// per-story lookups in readStory2 never touch Parquet. Sorting by id lets
// DuckDB skip most of the table for `id IN (...)` lookups.
function loadItems(): Promise<unknown> {
  itemsLoaded ??= (async () => {
    const start = performance.now();
    await client.run(`
      CREATE TABLE items AS
      SELECT id, text, deleted, dead, kids
      FROM read_parquet('${dataGlob}')
      QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
      ORDER BY id
    `);
    console.log(
      `[timing] loaded items table in ${((performance.now() - start) / 1000).toFixed(1)}s`,
    );
  })();
  return itemsLoaded;
}

async function readItems(ids: number[]): Promise<ItemRow[]> {
  if (ids.length === 0) return [];

  const reader = await client.runAndReadAll(`
    SELECT id, text, deleted, dead, kids
    FROM items
    WHERE id IN (${ids.join(", ")})
  `);

  return reader.getRowObjectsJS() as ItemRow[];
}

export async function readStory2(id: number): Promise<StoryRow> {
  await loadItems();

  const comments: StoryRow["comments"] = [];

  async function collectComments(ids: number[]) {
    for (const item of await readItems(ids)) {
      if (!item.deleted && !item.dead) {
        comments.push({ id: item.id, htmlText: item.text ?? "" });
      }

      // Replies to deleted or dead comments can still be live.
      await collectComments(item.kids ?? []);
    }
  }

  const [story] = await readItems([id]);
  await collectComments(story?.kids ?? []);

  comments.sort((a, b) => a.id - b.id);
  return storyRowSchema.parse({ id, comments });
}

type ChildRow = {
  id: number;
  parent: number;
  deleted: number | null;
  dead: number | null;
};

// Walks the comment trees one level at a time via the parent column, so each
// query touches exactly the items it needs regardless of how old the stories are.
// Reading `text` has a fixed cost per query, so it is fetched once at the end.
export async function fetchStories(storyIds: number[]): Promise<StoryRow[]> {
  if (storyIds.length === 0) return [];

  const ids = storyIds.map((id) => Math.trunc(id));
  // Live comment ids, mapped to the story they belong to.
  const commentStoryIds = new Map<number, number>();

  // Item ids of the current tree level, mapped to the story they belong to.
  let level = new Map<number, number>(ids.map((id) => [id, id]));

  while (level.size > 0) {
    const children = await readChildren([...level.keys()]);
    const nextLevel = new Map<number, number>();

    for (const child of children) {
      const storyId = level.get(child.parent);
      // The latest version of this item was moved to a different parent.
      if (storyId === undefined) continue;

      // Keep walking below deleted/dead comments; their replies can be live.
      nextLevel.set(child.id, storyId);

      if (!child.deleted && !child.dead) {
        commentStoryIds.set(child.id, storyId);
      }
    }

    level = nextLevel;
  }

  const texts = await readTexts([...commentStoryIds.keys()]);
  const commentsByStory = new Map<number, StoryRow["comments"]>(
    ids.map((id) => [id, []]),
  );

  for (const [commentId, storyId] of commentStoryIds) {
    commentsByStory.get(storyId)!.push({
      id: commentId,
      htmlText: texts.get(commentId) ?? "",
    });
  }

  return ids.map((id) => {
    const comments = commentsByStory.get(id)!.toSorted((a, b) => a.id - b.id);
    return storyRowSchema.parse({ id, comments });
  });
}

// Returns the latest version of every item that has (or had) one of the given
// parents. Callers must check `parent` again, since items can be moved.
// Two queries with literal id lists, because DuckDB only pushes literal filters
// down into the Parquet scan, not `IN (subquery)`.
async function readChildren(parentIds: number[]): Promise<ChildRow[]> {
  const idResult = await client.runAndReadAll(`
    SELECT DISTINCT id
    FROM read_parquet('${dataGlob}')
    WHERE parent IN (${parentIds.join(", ")})
  `);
  const childIds = idResult.getRowObjectsJS().map((row) => Number(row.id));

  if (childIds.length === 0) return [];

  const result = await client.runAndReadAll(`
    SELECT id, parent, deleted, dead
    FROM read_parquet('${dataGlob}')
    WHERE id IN (${childIds.join(", ")})
    QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
  `);

  return result.getRowObjectsJS() as ChildRow[];
}

async function readTexts(ids: number[]): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map();

  const result = await client.runAndReadAll(`
    SELECT id, text
    FROM read_parquet('${dataGlob}')
    WHERE id IN (${ids.join(", ")})
    QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
  `);

  const rows = result.getRowObjectsJS() as {
    id: number;
    text: string | null;
  }[];
  return new Map(rows.map((row) => [row.id, row.text ?? ""]));
}
