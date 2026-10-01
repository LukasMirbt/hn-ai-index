import { describe, it, expect } from "vitest";
import { jobSchema, type Job } from "./jobSchema.ts";

describe("jobSchema", () => {
  const baseJob: Omit<Job, "text" | "url"> = {
    by: "justin",
    id: 192327,
    score: 6,
    time: 1210981217,
    title: "Justin.tv is looking for a Lead Flash Engineer!",
    type: "job",
  };

  const text = "Justin.tv is the biggest live video site online.";
  const url = "";

  it("rejects invalid json", () => {
    const json = { invalid: true };
    const result = jobSchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("accepts job without text and url", () => {
    const job = baseJob;
    const result = jobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it("accepts job with text", () => {
    const job: Job = {
      ...baseJob,
      text,
    };
    const result = jobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it("accepts job with url", () => {
    const job: Job = {
      ...baseJob,
      url,
    };
    const result = jobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });
});
