import { BarChart3, Sword, Users, Wrench } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn";

const items = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    href: "/users",
  },
  {
    title: "Settings",
    icon: Wrench,
    href: "/settings",
  },
  {
    title: "Tools",
    icon: Sword,
    href: "/tools",
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
            "text-muted-foreground hover:bg-muted hover:text-foreground h-12 gap-2 rounded-none",
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
