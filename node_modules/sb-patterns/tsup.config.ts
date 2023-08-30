import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const defaultConfig = {
    splitting: false,
    minify: !options.watch,
    format: ["cjs", "esm"],
    dts: {
      resolve: true,
    },
    treeshake: true,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
      options.conditions = ["module"];
    },
  };

  return [
    {
      ...defaultConfig,
      entry: ["src/index.ts"],
      platform: "node",
    },
    {
      ...defaultConfig,
      entry: {
        client: "src/index.ts",
      },
      platform: "browser",
    },
  ];
});
