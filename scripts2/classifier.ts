import { fetchArticleData } from "./feature/data.ts";

const result = await fetchArticleData(49911995);
console.log(result);
