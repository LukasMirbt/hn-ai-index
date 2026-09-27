import { fetchJob } from "./api/hnClient.ts";

const job = await fetchJob(49524704);
console.log(job);
