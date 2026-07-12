import type { ActivityEvent } from "./seed";

import { ACTIVITY } from "./seed";

export const ACTIVITY_PAGE_SIZE = 100;

export interface ActivityPage {
  events: ActivityEvent[];
  /** Offset to request next, or null when the feed is exhausted. */
  nextCursor: number | null;
  total: number;
}

/** Pure, dataset injectable -- see queryMembers. */
export function queryActivity(
  cursor: number,
  dataset: ActivityEvent[] = ACTIVITY,
): ActivityPage {
  const start = Math.max(0, cursor);
  const end = start + ACTIVITY_PAGE_SIZE;
  const events = dataset.slice(start, end);

  return {
    events,
    nextCursor: end < dataset.length ? end : null,
    total: dataset.length,
  };
}
