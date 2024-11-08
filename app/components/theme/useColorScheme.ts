import { useCallback, useEffect, useRef, useState } from "react";

import type { ColorScheme, ColorSchemeManager } from "./localStorageManager";
import { useIsomorphicEffect } from "~/hooks/useIsomorphicEffect";
import { localStorageColorSchemeManager } from "./localStorageManager";

function setColorSchemeAttribute(
  colorScheme: ColorScheme,
  getRootElement: () => HTMLElement | undefined,
) {
  const computedColorScheme =
    colorScheme !== "system"
      ? colorScheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  getRootElement()?.setAttribute("data-color-scheme", computedColorScheme);
  getRootElement()?.classList.remove("dark", "light");
  getRootElement()?.classList.add(computedColorScheme);
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

export interface UseProviderColorSchemeOptions {
  manager?: ColorSchemeManager;
  defaultColorScheme?: ColorScheme;
  forceColorScheme?: "light" | "dark";
  getRootElement?: () => HTMLElement | undefined;
}

export interface ProviderColorScheme {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  clearColorScheme: () => void;
}

export function useProviderColorScheme({
  manager = localStorageColorSchemeManager(),
  defaultColorScheme = "system",
  getRootElement = () => document.documentElement,
  forceColorScheme,
}: UseProviderColorSchemeOptions): ProviderColorScheme {
  const media = useRef<MediaQueryList>();
  const [value, setValue] = useState(() => manager.get(defaultColorScheme));
  const colorSchemeValue = forceColorScheme || value;

  const setColorScheme = useCallback(
    (colorScheme: ColorScheme) => {
      if (!forceColorScheme) {
        setColorSchemeAttribute(colorScheme, getRootElement);
        setValue(colorScheme);
        manager.set(colorScheme);
      }
    },
    [forceColorScheme, getRootElement, manager],
  );

  const clearColorScheme = useCallback(() => {
    setValue(defaultColorScheme);
    setColorSchemeAttribute(defaultColorScheme, getRootElement);
    manager.clear();
  }, [defaultColorScheme, getRootElement, manager]);

  useEffect(() => {
    manager.subscribe(setColorScheme);
    return manager.unsubscribe;
  }, [manager, manager.subscribe, manager.unsubscribe, setColorScheme]);

  useIsomorphicEffect(() => {
    setColorSchemeAttribute(manager.get(defaultColorScheme), getRootElement);
  }, []);

  useEffect(() => {
    if (forceColorScheme) {
      setColorSchemeAttribute(forceColorScheme, getRootElement);
      return () => {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (forceColorScheme === undefined) {
      setColorSchemeAttribute(value, getRootElement);
    }

    media.current = window.matchMedia("(prefers-color-scheme: dark)");
    const listener: MediaQueryCallback = (event) => {
      if (value === "system") {
        setColorSchemeAttribute(
          event.matches ? "dark" : "light",
          getRootElement,
        );
      }
    };

    media.current.addEventListener("change", listener);
    return () => media.current?.removeEventListener("change", listener);
  }, [value, forceColorScheme, getRootElement]);

  return { colorScheme: colorSchemeValue, setColorScheme, clearColorScheme };
}
