import { defineConfig } from 'vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await"
import {viteStaticCopy} from 'vite-plugin-static-copy'


// https://vitejs.dev/config/
export default defineConfig({
 // base: process.env.ELECTRON=="true" ? './' : ".",
 // base: process.env.ELECTRON=="true" ? './' : "/",
  base: process.env.ELECTRON=="true" ? './' : "./",
  plugins: [
    wasm({
      // By default ALL `.wasm` imports will be transformed to WebAssembly ES module.
      // You can also set a filter (function or regex) to match files you want to transform.
      // Other files will fallback to Vite's default WASM loader (i.e. You need to call `initWasm()` for them).
      //filter: /syntect_bg.wasm$/
      //filter: /.wasm$/
    }),
    topLevelAwait(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/box2d-wasm/dist/es/Box2D.wasm',
          dest: 'assets/'
        },
        {
          src: 'node_modules/box2d-wasm/dist/es/Box2D.simd.wasm',
          dest: 'assets/'
        }
      ]
    })

  ]  
})
