import type { ReactNode } from "react";

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
    <div className="bg-background min-h-screen">
      {/* Top Navigation */}
      <header className="border-border border-b">
        <div className="flex h-16 items-center gap-4 px-4">
          <MainNav />
          <div className="ml-auto flex items-center gap-4">
            <Search />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
        {/* Secondary Navigation */}
        <div className="border-border bg-muted/50 border-t">
          <div className="px-4">
            <SideNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
