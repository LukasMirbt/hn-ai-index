import { fetchPollopt } from "./api/hnApi.ts";

const job = await fetchPollopt(160705);
console.log(job);
