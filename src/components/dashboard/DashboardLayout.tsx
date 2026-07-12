import type { ReactNode } from "react";

import { LocaleToggle } from "../theme/LocaleToggle";
import { ThemeToggle } from "../theme/ThemeToggle";
import { MainNav } from "./MainNav";
import { Search } from "./Search";
import { SideNav } from "./SideNav";
import { UserNav } from "./UserNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="flex h-16 items-center gap-4 px-4">
          <MainNav />
          <div className="ms-auto flex items-center gap-2">
            <Search />
            <LocaleToggle />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
        <div className="border-t border-border bg-muted/50">
          <div className="px-4">
            <SideNav />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
