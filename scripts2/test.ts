import { fetchPollopt } from "./firebaseApi/firebaseApi.ts";

const job = await fetchPollopt(160705);
console.log(job);
