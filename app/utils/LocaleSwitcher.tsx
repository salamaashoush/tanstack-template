import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { locales } from "~/i18n/runtime";
import { useI18n } from "./useI18n";

export function LocaleSwitcher() {
  const { currentLanguage, setLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {currentLanguage}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((tag) => (
          <DropdownMenuItem onClick={() => setLanguage(tag)} key={tag}>
            {tag}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
