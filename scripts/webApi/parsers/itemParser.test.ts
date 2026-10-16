import { describe, it, expect } from "vitest";
import { detectSlop } from "./itemParser.ts";

describe("itemParser", () => {
  describe("hasSlop", () => {
    type TestCase = {
      htmlText: string;
      expected: boolean;
    };

    const cases: TestCase[] = [
      {
        htmlText: "This is slop",
        expected: true,
      },
      {
        htmlText: "Slop is great.",
        expected: true,
      },
      {
        htmlText: `You call this "slop"?`,
        expected: true,
      },
      {
        htmlText: "This is sloppy",
        expected: false,
      },
      {
        htmlText: "Fantastic ski slope",
        expected: false,
      },
      {
        htmlText: "This is great",
        expected: false,
      },
      {
        htmlText: "",
        expected: false,
      },
    ];

    it.each(cases)(
      'returns $expected when htmlText is "$htmlText"',
      ({ htmlText, expected }) => {
        const result = detectSlop(htmlText);
        expect(result).toBe(expected);
      },
    );
  });
});
