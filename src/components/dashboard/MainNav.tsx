import { Link } from "@tanstack/react-router";

import { Logo } from "~/components/common/Logo";
import * as m from "~/i18n/messages";

export function MainNav() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 font-semibold text-foreground"
    >
      <Logo />
      <span className="hidden sm:inline">{m.commonCompanyName()}</span>
    </Link>
  );
}
