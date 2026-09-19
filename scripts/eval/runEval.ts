/**
 * Runs a classifier against labeled.json and prints precision / recall / F1.
 * Usage: node_modules/.bin/tsx scripts/eval/run-eval.ts
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { KeywordClassifier } from "./keywordClassifier.js";
import type { Candidate } from "./fetchCandidates.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const load = (): Candidate[] => {
  const path = join(__dirname, "labeled.json");
  const all: Candidate[] = JSON.parse(readFileSync(path, "utf-8"));
  return all.filter((c) => c.label !== null);
};

const metrics = (tp: number, fp: number, fn: number) => {
  const precision = tp / (tp + fp) || 0;
  const recall    = tp / (tp + fn) || 0;
  const f1        = (2 * precision * recall) / (precision + recall) || 0;
  return { precision, recall, f1 };
};

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// ---- run ----

const labeled = load();
const classifier = KeywordClassifier;

const results = labeled.map((c) => ({
  candidate: c,
  label: c.label as boolean,
  ...classifier.classify(c),
}));

const tp = results.filter((r) => r.result && r.label).length;
const fp = results.filter((r) => r.result && !r.label).length;
const fn = results.filter((r) => !r.result && r.label).length;
const tn = results.filter((r) => !r.result && !r.label).length;
const { precision, recall, f1 } = metrics(tp, fp, fn);

console.log(`\nClassifier : ${classifier.name}`);
console.log(`Labeled    : ${labeled.length}\n`);
console.log(`  TP ${tp}   FP ${fp}`);
console.log(`  FN ${fn}   TN ${tn}\n`);
console.log(`  Precision : ${pct(precision)}`);
console.log(`  Recall    : ${pct(recall)}`);
console.log(`  F1        : ${pct(f1)}\n`);

const falsePositives = results.filter((r) => r.result && !r.label);
const falseNegatives = results.filter((r) => !r.result && r.label);

if (falsePositives.length) {
  console.log(`False positives (${falsePositives.length}):`);
  falsePositives.forEach((r) => console.log(`  [${r.candidate.id}] (${r.reason}) ${r.candidate.title}`));
  console.log();
}

if (falseNegatives.length) {
  console.log(`False negatives (${falseNegatives.length}):`);
  falseNegatives.forEach((r) => console.log(`  [${r.candidate.id}] ${r.candidate.title}`));
  console.log();
}
