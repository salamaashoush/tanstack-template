import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  cookieName?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  cookieName = "theme",
  ...props
}: ThemeProviderProps) {
  const [cookies, setCookie] = useCookies([cookieName]);
  const [theme, setThemeState] = useState<Theme>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => (cookies[cookieName] as Theme) || defaultTheme,
  );

  // Inject script to prevent flash
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `
      try {
        const theme = document.cookie
          .split('; ')
          .find(row => row.startsWith('${cookieName}='))
          ?.split('=')[1] || '${defaultTheme}';

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.add(systemTheme);
        } else {
          document.documentElement.classList.add(theme);
        }
      } catch (e) {
        console.warn('Theme initialization failed:', e);
      }
    `;
    document.head.appendChild(script);
  }, [cookieName, defaultTheme]);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setCookie(cookieName, newTheme, {
      path: "/",
      secure: true,
      sameSite: "strict",
      maxAge: 31536000, // 1 year
    });
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
