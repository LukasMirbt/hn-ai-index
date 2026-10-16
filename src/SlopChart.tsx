import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SlopChartTooltip from "./SlopChartTooltip";
import type { SlopChartPoint } from "./SlopChartTooltip";
import { monthStartTicks } from "./prepareSlopChartData";
import type { TooltipContentProps } from "recharts";

interface Props {
  data: SlopChartPoint[];
}

const ORANGE = "#ff6600";
const MUTED_TEXT = "#6b6b6b";
const GRID = "#ececec";
const AXIS = "#d0d0d0";

function formatMonth(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleString("en", { month: "short" });
}

export default function SlopChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          ticks={monthStartTicks(data)}
          tickFormatter={formatMonth}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: AXIS }}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ stroke: AXIS }}
          content={({ active, payload, label }: TooltipContentProps) => (
            <SlopChartTooltip active={active} payload={payload} label={label} />
          )}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          wrapperStyle={{ fontSize: 12, color: MUTED_TEXT, paddingBottom: 8 }}
        />
        <Line
          name="Daily"
          type="linear"
          dataKey="shareWithSlop"
          stroke={ORANGE}
          strokeOpacity={0.3}
          strokeWidth={1}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Line
          name="7-day average"
          type="linear"
          dataKey="rollingShare"
          stroke={ORANGE}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
