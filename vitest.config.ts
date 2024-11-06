import react from "@vitejs/plugin-react-swc";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), viteTsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    exclude: [...configDefaults.exclude, "e2e/**/*"],
    // reporters: ["default", "html"],
    environment: "happy-dom",
    setupFiles: ["happy-dom.setup.ts"],
  },
});
