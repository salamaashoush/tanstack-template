import type { MemberStatus } from "~/data/seed";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/cn";
import { statusLabel } from "~/utils/memberLabels";

// Semantic, not decorative. The `default` badge variant is crimson in this theme,
// which made a healthy member read as an alarm and left "active" and "suspended"
// both red. A dot carries the same signal for anyone who cannot rely on colour.
const STATUS_STYLES: Record<MemberStatus, { badge: string; dot: string }> = {
  active: {
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
  },
  invited: {
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  suspended: {
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

export function StatusBadge({ status }: { status: MemberStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <Badge variant="outline" className={cn("gap-1.5", style.badge)}>
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {statusLabel(status)}
    </Badge>
  );
}
