import type { ChartPoint } from "./ChartTooltip";

interface PostResult {
  id: number;
  title: string;
  domain: string | null;
  relevance: number;
}

export interface DayResult {
  date: string;
  posts: PostResult[];
}

export function prepareChartData(data: DayResult[]): ChartPoint[] {
  return data.map((day) => {
    const scores = day.posts.map((p) => p.relevance);
    const mean = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const aiPosts = day.posts.filter((p) => p.relevance >= 0.5);
    return {
      date: day.date,
      meanRelevance: parseFloat(mean.toFixed(3)),
      aiPostCount: aiPosts.length,
      totalPosts: day.posts.length,
      topAiPosts: [...aiPosts].sort((a, b) => b.relevance - a.relevance).slice(0, 5),
    };
  });
}
