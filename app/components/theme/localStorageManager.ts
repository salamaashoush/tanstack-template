export type ColorScheme = "system" | "dark" | "light";
export interface ColorSchemeManager {
  /** Function to retrieve color scheme value from external storage, for example window.localStorage */
  get: (defaultValue: ColorScheme) => ColorScheme;

  /** Function to set color scheme value in external storage, for example window.localStorage */
  set: (value: ColorScheme) => void;

  /** Function to subscribe to color scheme changes triggered by external events */
  subscribe: (onUpdate: (colorScheme: ColorScheme) => void) => void;

  /** Function to unsubscribe from color scheme changes triggered by external events */
  unsubscribe: () => void;

  /** Function to clear value from external storage */
  clear: () => void;
}
export function isColorScheme(value: unknown): value is ColorScheme {
  return value === "auto" || value === "dark" || value === "light";
}

export interface ColorSchemeManagerOptions {
  key?: string;
}

export function localStorageColorSchemeManager({
  key = "color-scheme",
}: ColorSchemeManagerOptions = {}): ColorSchemeManager {
  let handleStorageEvent: (event: StorageEvent) => void;

  return {
    get: (defaultValue) => {
      if (typeof window === "undefined") {
        return defaultValue;
      }

      try {
        const storedColorScheme = window.localStorage.getItem(key);
        return isColorScheme(storedColorScheme)
          ? storedColorScheme
          : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    set: (value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn(
          "Local storage color scheme manager was unable to save color scheme.",
          error,
        );
      }
    },

    subscribe: (onUpdate) => {
      handleStorageEvent = (event) => {
        if (
          event.storageArea === window.localStorage &&
          event.key === key &&
          isColorScheme(event.newValue)
        ) {
          onUpdate(event.newValue);
        }
      };

      window.addEventListener("storage", handleStorageEvent);
    },

    unsubscribe: () => {
      window.removeEventListener("storage", handleStorageEvent);
    },

    clear: () => {
      window.localStorage.removeItem(key);
    },
  };
}
