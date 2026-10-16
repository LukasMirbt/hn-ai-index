import type { TooltipPayload } from "recharts";

export interface SlopChartPoint {
  date: string;
  shareWithSlop: number;
  rollingShare: number;
  totalSlop: number;
  storiesWithSlop: number;
  totalStories: number;
  maxInOneStory: number;
}

interface Props {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
}

export default function SlopChartTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as SlopChartPoint;
  return (
    <div className="tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-headline">
        {d.rollingShare.toFixed(0)}% <span>7-day average</span>
      </p>
      <p className="tooltip-detail">
        This day: {d.storiesWithSlop}/{d.totalStories} stories with slop
      </p>
      <p className="tooltip-detail">
        {d.totalSlop} slop comments · most in one story: {d.maxInOneStory}
      </p>
    </div>
  );
}
