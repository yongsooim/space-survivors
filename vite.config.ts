import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { viteStaticCopy } from "vite-plugin-static-copy";
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'
import { hash } from './src/utils/functions.js' // found this solution at https://stackoverflow.com/questions/68046410/how-to-force-vite-clearing-cache-in-vue3

// https://vitejs.dev/config/
export default defineConfig({
  server:{
   // hmr: {path:'./src'}
    hmr: false
  },
  worker: {
    format: 'es'
  },
  base: process.env.ELECTRON == "true" ? "./" : "./",
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
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
        {
          src: "src/asset/netlify.toml",  // for netlify cross origin setting
          dest: "./",
        }
      ]
    })
  ],
});
