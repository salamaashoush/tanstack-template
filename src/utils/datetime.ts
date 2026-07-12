import { getLocale } from "~/i18n/runtime";

const DAY_MS = 86_400_000;

/**
 * `now` is injectable so callers can render a stable value. The seeded fixtures
 * are dated relative to a fixed epoch, so passing the wall clock here would make
 * the rendered output drift over time (and differ between server and client).
 */
export function formatRelativeDays(
  isoDate: string,
  now: number = Date.parse("2026-07-01T00:00:00.000Z"),
): string {
  const days = Math.round((Date.parse(isoDate) - now) / DAY_MS);
  const formatter = new Intl.RelativeTimeFormat(getLocale(), {
    numeric: "auto",
  });
  return formatter.format(days, "day");
}

export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
