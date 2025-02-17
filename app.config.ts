import { paraglide } from "@inlang/paraglide-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "node-server",
  },
  vite: {
    plugins: [
      tailwindcss(),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      paraglide({
        project: "./project.inlang", //Path to your inlang project
        outdir: "./app/i18n", //Where you want the generated files to be placed
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
