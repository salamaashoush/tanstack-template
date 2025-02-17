import type { ReactNode } from "react";

import { Logo } from "~/components/common/Logo";
import * as m from "~/i18n/messages";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const year = new Date().getFullYear();
  return (
    <div className="bg-background grid min-h-screen lg:grid-cols-2">
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <div className="p-8">
          <p className="text-muted-foreground text-center text-xs">
            {m.commonCopyRights({ year })}
          </p>
        </div>
      </div>
      <div className="bg-muted/50 hidden flex-col items-center justify-center p-12 lg:flex xl:p-16">
        <div className="w-full max-w-[480px] text-center">
          <Logo className="mx-auto mb-12" />
          <h1 className="text-foreground mb-6 text-[56px] leading-[1.1] font-semibold">
            {m.authLayoutTitle()}
          </h1>
          <p className="text-muted-foreground text-lg">{m.authLayoutBody()}</p>
        </div>
      </div>
    </div>
  );
}
