import { describe, it, expect } from "vitest";
import { polloptSchema } from "./polloptSchema.ts";
import type { Pollopt } from "./polloptSchema.ts";

describe("polloptSchema", () => {
  const pollopt: Pollopt = {
    by: "pg",
    id: 160705,
    poll: 160704,
    score: 335,
    text: "Yes, ban them; I'm tired of seeing Valleywag stories on News.YC.",
    time: 1207886576,
    type: "pollopt",
  };

  it("rejects invalid json", () => {
    const json = { invalid: true };
    const result = polloptSchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("accepts pollopt with correct data", () => {
    const result = polloptSchema.safeParse(pollopt);
    expect(result.success).toBe(true);
  });
});
