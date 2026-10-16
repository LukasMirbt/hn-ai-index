import slopData from "./data/slop.json";
import SlopChart from "./SlopChart";
import { prepareSlopChartData } from "./prepareSlopChartData";
import type { SlopResults } from "./prepareSlopChartData";

const chartData = prepareSlopChartData(slopData as SlopResults);

export default function App() {
  if (chartData.length === 0) {
    return (
      <div className="empty">
        <h2>HN AI Index</h2>
        <p>
          No data yet. Run <code>node_modules/.bin/tsx scripts/main.ts</code> to
          collect data.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>HN AI Index</h1>
      <p className="subtitle">
        Share of the top 30 HN front page stories per day with at least one
        comment mentioning "slop"
      </p>
      <SlopChart data={chartData} />
    </div>
  );
}
