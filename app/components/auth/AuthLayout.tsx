import type { ReactNode } from "react";

import { Logo } from "~/components/common/Logo";
import { useTranslation } from "~/i18n/client";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <div className="p-8">
          <p className="text-center text-xs text-muted-foreground">
            {t("common.copyRights", { year })}
          </p>
        </div>
      </div>
      <div className="hidden flex-col items-center justify-center bg-muted/50 p-12 lg:flex xl:p-16">
        <div className="w-full max-w-[480px] text-center">
          <Logo className="mx-auto mb-12" />
          <h1 className="mb-6 text-[56px] font-semibold leading-[1.1] text-foreground">
            {t("auth.layout.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("auth.layout.body")}
          </p>
        </div>
      </div>
    </div>
  );
}
