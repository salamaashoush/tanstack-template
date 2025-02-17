import { Search as SearchIcon } from "lucide-react";

import { Input } from "~/components/ui/input";

export function Search() {
  return (
    <div className="relative w-96">
      <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search your coins..."
        className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pl-8"
      />
    </div>
  );
}
