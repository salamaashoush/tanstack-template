import { createContext, useContext, useMemo } from "react";

import type {
  ProviderColorScheme,
  UseProviderColorSchemeOptions,
} from "./useColorScheme";
import { useProviderColorScheme } from "./useColorScheme";

interface ColorSchemeProviderProps extends UseProviderColorSchemeOptions {
  children: React.ReactNode;
}

const initialState: ProviderColorScheme = {
  colorScheme: "system",
  clearColorScheme: () => {},
  setColorScheme: () => {},
};

const ColorSchemeProviderContext =
  createContext<ProviderColorScheme>(initialState);

export function ColorSchemeProvider({
  children,
  ...props
}: ColorSchemeProviderProps) {
  const { setColorScheme, colorScheme, clearColorScheme } =
    useProviderColorScheme(props);

  const value = useMemo(
    () => ({ setColorScheme, colorScheme, clearColorScheme }),
    [setColorScheme, colorScheme, clearColorScheme],
  );

  return (
    <ColorSchemeProviderContext.Provider {...props} value={value}>
      {children}
    </ColorSchemeProviderContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeProviderContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined)
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");

  return context;
}
