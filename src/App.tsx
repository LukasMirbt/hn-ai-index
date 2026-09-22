import relevanceData from "./data/relevance.json";
import RelevanceChart from "./RelevanceChart";
import { prepareChartData } from "./prepareChartData";
import type { DayResult } from "./prepareChartData";

const chartData = prepareChartData(relevanceData as DayResult[]);

export default function App() {
  if (chartData.length === 0) {
    return (
      <div className="empty">
        <h2>HN AI Index</h2>
        <p>
          No data yet. Run <code>node_modules/.bin/tsx scripts/collect.ts</code>{" "}
          to collect data.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>HN AI Index</h1>
      <p className="subtitle">
        Mean AI relevance of the top 30 HN front page posts per day (0 = not AI,
        1 = entirely AI)
      </p>
      <RelevanceChart data={chartData} />
    </div>
  );
}
