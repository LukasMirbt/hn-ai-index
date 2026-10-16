import type { SlopChartPoint } from "./SlopChartTooltip";

export type SlopResults = Record<string, number[]>;

const ROLLING_WINDOW_DAYS = 7;

export function prepareSlopChartData(data: SlopResults): SlopChartPoint[] {
  const days = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => {
      const storiesWithSlop = counts.filter((c) => c > 0).length;
      return {
        date,
        shareWithSlop:
          counts.length > 0 ? (storiesWithSlop / counts.length) * 100 : 0,
        totalSlop: counts.reduce((a, b) => a + b, 0),
        storiesWithSlop,
        totalStories: counts.length,
        maxInOneStory: Math.max(0, ...counts),
      };
    });

  return days.map((day, i) => {
    const window = days.slice(Math.max(0, i - ROLLING_WINDOW_DAYS + 1), i + 1);
    const rollingShare =
      window.reduce((sum, d) => sum + d.shareWithSlop, 0) / window.length;
    return { ...day, rollingShare };
  });
}

export function monthStartTicks(points: SlopChartPoint[]): string[] {
  return points
    .filter(
      (p, i) =>
        i === 0 || p.date.slice(0, 7) !== points[i - 1].date.slice(0, 7),
    )
    .map((p) => p.date);
}
