/**
 * Runs all registered classifiers against a labeled test set and prints
 * MAE / RMSE for relevance and sentiment, plus the worst predictions.
 *
 * Usage:
 *   node_modules/.bin/tsx scripts/eval/runEval.ts              # uses testCases.json
 *   node_modules/.bin/tsx scripts/eval/runEval.ts --file labeled.json
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { KeywordClassifier } from "./keywordClassifier.js";
import { LlmClassifier } from "./LlmClassifier.js";
import type { Candidate } from "./fetchCandidates.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Register classifiers here ──────────────────────────────────────────────
const classifiers = [KeywordClassifier, LlmClassifier];

// ── Resolve data file ──────────────────────────────────────────────────────
const fileArg = process.argv.indexOf("--file");
const fileName = fileArg !== -1 ? process.argv[fileArg + 1] : "testCases.json";
const filePath = join(__dirname, fileName);

const all: Candidate[] = JSON.parse(readFileSync(filePath, "utf-8"));
const labeled = all.filter((c) => c.label !== null);

if (labeled.length === 0) {
  console.error(`No labeled entries found in ${fileName}.`);
  process.exit(1);
}

console.log(`\nData file  : ${fileName}`);
console.log(`Labeled    : ${labeled.length}\n`);

const fmt = (n: number) => n.toFixed(3);
const fmtS = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(3);
const mae = (errors: number[]) =>
  errors.reduce((s, e) => s + Math.abs(e), 0) / errors.length;
const rmse = (errors: number[]) =>
  Math.sqrt(errors.reduce((s, e) => s + e ** 2, 0) / errors.length);

// ── Run each classifier ────────────────────────────────────────────────────
for (const classifier of classifiers) {
  const results = await Promise.all(
    labeled.map(async (c) => {
      const pred = await classifier.classify(c);
      const label = c.label as { relevance: number };
      return {
        candidate: c,
        label,
        pred,
        relevanceError: pred.relevance - label.relevance,
      };
    }),
  );

  const relErrors = results.map((r) => r.relevanceError);

  console.log(`Classifier : ${classifier.name}`);
  console.log(
    `  Relevance  — MAE: ${fmt(mae(relErrors))}  RMSE: ${fmt(rmse(relErrors))}\n`,
  );

  const worst = [...results]
    .sort((a, b) => Math.abs(b.relevanceError) - Math.abs(a.relevanceError))
    .slice(0, 10);

  console.log(`  Worst relevance predictions:`);
  worst.forEach((r) => {
    console.log(
      `    ${fmtS(r.relevanceError)} [label=${fmt(r.label.relevance)} pred=${fmt(r.pred.relevance)}]` +
        ` (${r.pred.reason}) ${r.candidate.title}`,
    );
  });

  console.log("\n" + "─".repeat(60) + "\n");
}
