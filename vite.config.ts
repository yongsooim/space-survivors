import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        sourcemap: true,
        format: "es",
        //inlineDynamicImports: true,
      },
    },
    commonjsOptions: {
      dynamicRequireTargets: [
        //  'src/worker/enemyCollide.ts',
      ],
    },
  },
  //base: process.env.ELECTRON=="true" ? './' : ".",
  base: process.env.ELECTRON == "true" ? "./" : "/",
  //base: process.env.ELECTRON == "true" ? "./" : "./",

  plugins: [
    topLevelAwait(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/box2d-wasm/dist/es/Box2D.wasm",
          dest: "assets/",
        },
        {
          src: "node_modules/box2d-wasm/dist/es/Box2D.simd.wasm",
          dest: "assets/",
        },
      ],
    }),
  ],
});
