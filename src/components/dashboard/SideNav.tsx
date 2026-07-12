import type { LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";
import { Activity, LayoutDashboard, Users } from "lucide-react";

import * as m from "~/i18n/messages";
import { cn } from "~/utils/cn";

interface NavItem {
  to: LinkProps["to"];
  label: () => string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { to: "/dashboard", label: m.navOverview, icon: LayoutDashboard },
  { to: "/dashboard/members", label: m.navMembers, icon: Users },
  { to: "/dashboard/activity", label: m.navActivity, icon: Activity },
];

export function SideNav() {
  return (
    <nav className="flex" aria-label={m.navPrimary()}>
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          // exact only for the index: otherwise /dashboard stays active on
          // every child route.
          activeOptions={{ exact: to === "/dashboard" }}
          className={cn(
            "flex h-12 items-center gap-2 border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "data-[status=active]:border-primary data-[status=active]:text-foreground",
          )}
        >
          <Icon className="size-4" />
          {label()}
        </Link>
      ))}
    </nav>
  );
}
