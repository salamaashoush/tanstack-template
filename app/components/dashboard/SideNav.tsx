import {
  BarChart3,
  Binoculars,
  Shield,
  Sword,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn";

const items = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Observation",
    icon: Binoculars,
    href: "/observation",
  },
  {
    title: "Threats",
    icon: Shield,
    href: "/threats",
  },
  {
    title: "Arsenal",
    icon: Sword,
    href: "/arsenal",
  },
  {
    title: "Techniques",
    icon: Wrench,
    href: "/techniques",
  },
  {
    title: "Entities",
    icon: Users,
    href: "/entities",
  },
];

export function SideNav() {
  return (
    <nav className="flex">
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "h-12 gap-2 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground",
            item.href === "/threats" && "bg-muted text-foreground",
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
