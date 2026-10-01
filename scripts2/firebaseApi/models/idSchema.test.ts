import { describe, it, expect } from "vitest";
import { idSchema } from "./idSchema.ts";

describe("idSchema", () => {
  it("accepts positive integer", () => {
    const result = idSchema.safeParse(1);
    expect(result.success).toBe(true);
  });

  it("rejects negative number", () => {
    const result = idSchema.safeParse(-1);
    expect(result.success).toBe(false);
  });

  it("rejects decimal number", () => {
    const result = idSchema.safeParse(1.1);
    expect(result.success).toBe(false);
  });
});
