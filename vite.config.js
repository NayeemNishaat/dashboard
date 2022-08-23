import { defineConfig } from "vite";
// import { createVuePlugin } from 'vite-plugin-vue2';
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  // plugins: [createVuePlugin()],
  plugins: [vue()],
  server: {
    port: 8080
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      }
    ]
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  }
});

// import { defineConfig } from "vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// });

// export default {
//   resolve: {
//     alias: {
//       vue: "@vue/compat"
//     }
//   },
//   plugins: [
//     vue({
//       template: {
//         compilerOptions: {
//           compatConfig: {
//             MODE: 2
//           }
//         }
//       }
//     })
//   ]
// };
