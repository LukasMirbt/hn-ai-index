import { DuckDBInstance } from "@duckdb/node-api";
import path from "path";

const instance = await DuckDBInstance.create(":memory:");

export const connection = await instance.connect();

const dataGlob = path.resolve(
  import.meta.dirname,
  "../../data/hackernews_history/*.parquet",
);

export async function load() {
  const start = performance.now();

  await connection.run(`
          CREATE TABLE items AS
          SELECT id, text, deleted, dead, kids
          FROM read_parquet('${dataGlob}')
          QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
          ORDER BY id
        `);

  console.log(
    `[timing] loaded items table in ${((performance.now() - start) / 1000).toFixed(1)}s`,
  );
}
