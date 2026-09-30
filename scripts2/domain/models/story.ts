import * as api from "../../api/hnApi.ts";
import * as DateModel from "./date.ts";

export type Story = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: Date;
  title: string;
  url?: string;
};

export function from(item: api.Story): Story {
  return {
    by: item.by,
    descendants: item.descendants,
    id: item.id,
    kids: item.kids ?? [],
    score: item.score,
    time: DateModel.fromUnixTimestamp(item.time),
    title: item.title,
    url: item.url,
  };
}

export function topFiveCommentIds(story: Story): number[] {
  const topFiveIds = story.kids.slice(0, 5);
  return topFiveIds;
}

export function bottomFiveCommentIds(story: Story): number[] {
  const topFiveIds = story.kids.toReversed().slice(0, 5);
  return topFiveIds;
}
