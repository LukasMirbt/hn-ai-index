import {
  calculateSlopLocal,
  calculateSlopWeb,
} from "./feature/calculateSlop.ts";

const date = new Date("2026-01-16");

const localResult = await calculateSlopLocal(date);
const webResult = await calculateSlopWeb(date);

console.log("local", localResult);
console.log("web", webResult);
