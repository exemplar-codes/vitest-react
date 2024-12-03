import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";


// https://vitejs.dev/config/
export default ({ mode }) => {
  // using function notation (instead of object) since need to enable source map for staging (MODE="production" but APP_ENVIRONMENT is "staging")
  const loadedEnvs = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [eslint(), react()],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
        /*
      Aliased imports (preferred):
      - Alias for 'src': import MyComponent from "@/components/MyComponent"

      Other imports are unaffected:
      - npm imports: import React from 'react'
      - Org npm imports: "@storybook/react". "@/" doesnt clash since immediate slash.
      - Relative imports: "./components/MyComponent"
      */
      },
    },
    build: {
      sourcemap: loadedEnvs?.VITE_APP_ENVIRONMENT !== "production",
    },
    css: {
      preprocessorOptions: {
        scss: {
          // these two supress the Sass warnings
          // Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0. More info: https://sass-lang.com/d/legacy-js-api
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api", "import"], // https://sass-lang.com/documentation/breaking-changes/import/#silencing-specific-deprecations
          // adding "import" above causes "Future import deprecation is not yet active, so silencing it is unnecessary.", so removed
        },
      },
    },
    test: {
      onConsoleLog(log) {
        return !["{ name: undefined }", "React Router"].some((antiFilter) =>
          log.includes(antiFilter)
        );
      },
      css: true,
      environment: "jsdom",
      setupFiles: "vitest.setup.js",
      server: {
        deps: {
          inline: ["@openreplay/tracker"], // solves ESM-CJS issue in @openreplay/network-proxy is prevented
        },
      },
      exclude: [
        // e2e tests (Playwright) arent run by Vitest
        "tests",
        "tests-examples",
        // default values below (copied form Vitest)
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/[.]**",
        "packages/*/test?(s)/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        // "**/\x00*",
        "cypress/**",
        "test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        // "**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
      ],
    },
    server: {
      host: "volodeptsg.lvh.me",
      open: true,
      warmup: {
        clientFiles: ["src/**/*.js", "src/**/*.jsx"],
      },
    },
  });
};
