import type { TooltipPayload } from "recharts";

interface PostResult {
  id: number;
  title: string;
  relevance: number;
}

export interface ChartPoint {
  date: string;
  meanRelevance: number;
  aiPostCount: number;
  totalPosts: number;
  topAiPosts: PostResult[];
}

interface Props {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
}

export default function ChartTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ChartPoint;
  return (
    <div className="tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-summary">
        Mean relevance: {d.meanRelevance.toFixed(2)} · {d.aiPostCount}/{d.totalPosts} AI posts
      </p>
      {d.topAiPosts.length > 0 && (
        <ul className="tooltip-posts">
          {d.topAiPosts.map((p) => (
            <li key={p.id}>
              <span className="tooltip-score">{p.relevance.toFixed(2)}</span>
              {p.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
