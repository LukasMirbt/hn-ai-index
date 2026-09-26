export interface HnItem {
  id: number;
  title?: string;
  url?: string;
  text?: string;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

export type HnStory = HnItem & { title: string };

export const isLiveItem = (value: unknown): value is HnItem => {
  const valueIsHnItem = isHnItem(value);
  if (!valueIsHnItem) return false;
  const isRemoved = value.deleted || value.dead;
  return !isRemoved;
};

export const isStory = (item: HnItem | null): item is HnStory => {
  const hasTitle = Boolean(item?.title);
  return hasTitle;
};

const isHnItem = (value: unknown): value is HnItem => {
  const isObject = typeof value === "object" && value !== null;
  const isError = isObject && "error" in value;
  return isObject && !isError;
};
