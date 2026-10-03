import { fetchItem } from "./webApi/webApi.ts";

const result = await fetchItem(49932147);

/* const ids = await fetchFrontPage({ date: new Date("2026-10-01") });
const result = await fetchArticleData(49911995); */
console.log(result);
