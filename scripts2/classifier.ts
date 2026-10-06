import { calculateSlop } from "./feature/calculateSlop.ts";

const date = new Date("2026-10-01");
const result = await calculateSlop(date);
console.log(result);
