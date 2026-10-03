import { fetchFrontPage } from "./domain/hnRepository.ts";
import { fetchArticleData } from "./feature/data.ts";

const ids = await fetchFrontPage({ date: new Date("2026-10-01") });
const result = await fetchArticleData(49911995);
console.log(result);
