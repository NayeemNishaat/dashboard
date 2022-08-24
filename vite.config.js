// import { defineConfig } from "vite";
// import { createVuePlugin } from "vite-plugin-vue2";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import path from "path";

// export default defineConfig({
//   // plugins: [createVuePlugin()],
//   plugins: [vue()],
//   server: {
//     port: 8080
//   },
//   resolve: {
//     alias: [
//       {
//         find: "@",
//         replacement: path.resolve(__dirname, "src")
//       }
//     ]
//   },
//   build: {
//     chunkSizeWarningLimit: 600,
//     cssCodeSplit: false
//   }
// });

// vite.config.js
export default {
  resolve: {
    alias: {
      vue: "@vue/compat"
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
};
