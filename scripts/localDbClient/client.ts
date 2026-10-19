import { DuckDBInstance } from "@duckdb/node-api";
import path from "path";

const instance = await DuckDBInstance.create(":memory:");

export const connection = await instance.connect();

export const dataGlob = path.resolve(
  import.meta.dirname,
  "../../data/hackernews_history/*.parquet",
);

export async function load() {
  await connection.run(`
          CREATE TABLE items AS
          SELECT id, text, deleted, dead, kids
          FROM read_parquet('${dataGlob}')
          QUALIFY row_number() OVER (PARTITION BY id ORDER BY update_time DESC) = 1
          ORDER BY id
        `);
}
