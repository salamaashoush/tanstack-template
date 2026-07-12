import { Languages } from "lucide-react";

import type { Locale } from "~/i18n/runtime";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import * as m from "~/i18n/messages";
import { getLocale, locales, setLocale } from "~/i18n/runtime";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function LocaleToggle() {
  const current = getLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={m.localeToggleLabel()}
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Languages className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            // setLocale writes the cookie and reloads, so the next document is
            // server-rendered in the new locale with the correct dir -- no
            // half-translated client re-render.
            onClick={() => {
              void setLocale(locale);
            }}
            data-checked={locale === current}
            className="data-checked:bg-muted"
          >
            {LOCALE_LABELS[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
