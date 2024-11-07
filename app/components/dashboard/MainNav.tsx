import { Logo } from "~/components/common/Logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/utils/cn";

const items = [
  { title: "Fake Company", href: "/" },
  { title: "News", href: "/news" },
  { title: "Learning", href: "/learning" },
];

export function MainNav() {
  return (
    <div className="flex items-center gap-6">
      <Logo className="hidden lg:inline-flex" />
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                href={item.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
