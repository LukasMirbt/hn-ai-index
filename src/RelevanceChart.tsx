import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import type { ChartPoint } from "./ChartTooltip";
import type { TooltipContentProps } from "recharts";

interface Props {
  data: ChartPoint[];
}

export default function RelevanceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#888", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#333" }}
        />
        <YAxis
          domain={[0, 1]}
          tick={{ fill: "#888", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#333" }}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <Tooltip content={({ active, payload, label }: TooltipContentProps) => (
            <ChartTooltip active={active} payload={payload} label={label} />
          )} />
        <Line
          type="monotone"
          dataKey="meanRelevance"
          stroke="#ff6600"
          strokeWidth={2}
          dot={{ fill: "#ff6600", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
