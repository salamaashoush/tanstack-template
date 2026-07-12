import type { ReactNode } from "react";

import { cn } from "~/utils/cn";

interface StatusPageProps {
  /** Short, e.g. "404". Rendered large and muted behind the title. */
  code?: string;
  icon?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Shared chrome for the terminal states (error, not found). Keeping them in one
 * component is what stops them drifting apart visually.
 */
export function StatusPage({
  code,
  icon,
  title,
  description,
  actions,
  children,
  className,
}: StatusPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}

      {code ? (
        <p className="mb-2 text-sm font-medium tracking-widest text-muted-foreground uppercase">
          {code}
        </p>
      ) : null}

      <h1 className="text-2xl font-semibold text-balance text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-pretty text-muted-foreground">
        {description}
      </p>

      {actions ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      ) : null}

      {children ? (
        <div className="mt-8 w-full max-w-2xl">{children}</div>
      ) : null}
    </div>
  );
}
