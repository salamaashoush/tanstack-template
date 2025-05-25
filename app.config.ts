// import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "@tanstack/react-start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "node-server",
  },
  vite: {
    plugins: [
      // TODO: use tailwindcss plugin instead of postcss once tailwindcss/tanstack-start issue is fixed
      // tailwindcss(),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      paraglideVitePlugin({
        project: "./project.inlang", //Path to your inlang project
        outdir: "./app/i18n", //Where you want the generated files to be placed
      }),
    ],
  },
});
