import * as m from "~/i18n/messages";
import { cn } from "~/utils/cn";

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};
type Size = keyof typeof sizes;
interface LogoProps {
  className?: string;
  showText?: boolean;
  animate?: boolean;
  size?: Size;
}

export function Logo({
  className,
  showText = false,
  animate = false,
  size = "md",
}: LogoProps) {
  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className={cn("relative", sizes[size])}>
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="h-full w-full text-destructive">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <g
              className={animate ? "animate-spin-slow" : ""}
              style={{ transformOrigin: "center" }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="10"
                  r="4"
                  fill="currentColor"
                  transform={`rotate(${i * 30} 50 50)`}
                  opacity={0.2 + i * 0.1}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
      {showText && (
        <span className="mt-1 text-sm font-medium text-foreground">
          {m.commonCompanyName()}
        </span>
      )}
    </div>
  );
}
