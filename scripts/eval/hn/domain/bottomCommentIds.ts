const DEFAULT_BOTTOM_COMMENT_WINDOW = 20;

export const selectBottomCommentIds = (
  kids: number[],
  count: number,
  window = DEFAULT_BOTTOM_COMMENT_WINDOW,
): number[] => {
  const selectionSize = Math.max(count, window);
  const bottomKids = kids.slice(-selectionSize);
  const lowestFirst = bottomKids.reverse();
  return lowestFirst;
};
