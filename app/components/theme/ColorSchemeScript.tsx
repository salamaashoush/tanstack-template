import type { ColorScheme } from "./localStorageManager";

export interface ColorSchemeScriptProps
  extends React.ComponentPropsWithoutRef<"script"> {
  forceColorScheme?: "light" | "dark";
  defaultColorScheme?: ColorScheme;
  localStorageKey?: string;
}

const getScript = ({
  defaultColorScheme,
  localStorageKey,
  forceColorScheme,
}: Pick<
  ColorSchemeScriptProps,
  "defaultColorScheme" | "localStorageKey" | "forceColorScheme"
>) =>
  forceColorScheme
    ? `document.documentElement.setAttribute("data-color-scheme", '${forceColorScheme}');`
    : `try {
  var _colorScheme = window.localStorage.getItem("${localStorageKey}");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "${defaultColorScheme}";
  var computedColorScheme = colorScheme !== "system" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-color-scheme", computedColorScheme);
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(computedColorScheme);
} catch (e) {}
`;

export function ColorSchemeScript({
  defaultColorScheme = "light",
  localStorageKey = "color-scheme",
  forceColorScheme,
  ...others
}: ColorSchemeScriptProps) {
  const _defaultColorScheme = ["light", "dark", "system"].includes(
    defaultColorScheme,
  )
    ? defaultColorScheme
    : "light";
  return (
    <script
      {...others}
      data-color-scheme-script
      dangerouslySetInnerHTML={{
        __html: getScript({
          defaultColorScheme: _defaultColorScheme,
          localStorageKey,
          forceColorScheme,
        }),
      }}
    />
  );
}
