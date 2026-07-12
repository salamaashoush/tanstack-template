import { useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useCallback } from "react";

import { Input } from "~/components/ui/input";
import * as m from "~/i18n/messages";
import { DEFAULT_MEMBERS_QUERY } from "~/schema/members";

export function Search() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get("q");
      void navigate({
        to: "/dashboard/members",
        search: {
          ...DEFAULT_MEMBERS_QUERY,
          q: typeof query === "string" ? query : "",
        },
      });
    },
    [navigate],
  );

  return (
    <search className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <SearchIcon
          className="absolute start-2 top-2.5 size-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="q"
          type="search"
          className="ps-8"
          aria-label={m.searchMembersLabel()}
          placeholder={m.searchMembersPlaceholder()}
        />
      </form>
    </search>
  );
}
