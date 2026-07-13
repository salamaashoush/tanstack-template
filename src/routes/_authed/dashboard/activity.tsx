import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef } from "react";

import { Badge } from "~/components/ui/badge";
import * as m from "~/i18n/messages";
import { activityQuery } from "~/queries/activity";
import { formatDateTime, formatNumber } from "~/utils/datetime";

const ROW_HEIGHT = 64;
const OVERSCAN = 8;

export const Route = createFileRoute("/_authed/dashboard/activity")({
  loader: ({ context }) =>
    context.queryClient.ensureInfiniteQueryData(activityQuery),
  component: ActivityPage,
});

function ActivityPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(activityQuery);

  const events = useMemo(
    () => data?.pages.flatMap((page) => page.events) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    // One extra row when more pages exist: it is the sentinel whose appearance
    // triggers the next fetch.
    count: hasNextPage ? events.length + 1 : events.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const lastRow = virtualRows.at(-1);

  useEffect(() => {
    if (!lastRow || !hasNextPage || isFetchingNextPage) {
      return;
    }
    // The sentinel scrolled into view.
    if (lastRow.index >= events.length) {
      void fetchNextPage();
    }
  }, [lastRow, hasNextPage, isFetchingNextPage, events.length, fetchNextPage]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {m.activityTitle()}
        </h1>
        <p className="text-muted-foreground">
          {m.activitySubtitle({ total: formatNumber(total) })}
        </p>
      </header>

      <div
        ref={scrollRef}
        data-testid="activity-scroller"
        className="h-[540px] overflow-y-auto rounded-md border border-border"
      >
        {/* Full-height spacer: the scrollbar reflects all rows, while only the
            visible window is mounted. */}
        <div
          style={{ height: virtualizer.getTotalSize() }}
          className="relative w-full"
        >
          {virtualRows.map((virtualRow) => {
            const event = events[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute inset-x-0 top-0 flex items-center gap-4 border-b border-border px-4"
                style={{
                  height: ROW_HEIGHT,
                  transform: `translateY(${String(virtualRow.start)}px)`,
                }}
              >
                {event ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">
                        <span className="font-medium">{event.actor}</span>{" "}
                        {event.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(event.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline">{event.target}</Badge>
                  </>
                ) : (
                  <p className="w-full text-center text-sm text-muted-foreground">
                    {m.activityLoadingMore()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
