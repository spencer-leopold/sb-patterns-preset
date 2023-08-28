import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/preset.ts"],
  splitting: false,
  minify: !options.watch,
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: "node",
  external: ["webpack"],
  esbuildOptions(options) {
    options.conditions = ["module"];
  },
}));
