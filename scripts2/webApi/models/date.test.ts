import { describe, it, expect } from "vitest";
import * as DateModel from "./date.ts";

describe("date", () => {
  it("toYYYYMMDD", () => {
    const date = new Date(1);
    const dateString = DateModel.toYYYYMMDD(date);
    expect(dateString).toEqual("1970-01-01");
  });
});
