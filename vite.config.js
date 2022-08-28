import { defineConfig } from "vite";
import createVuePlugin from "@vitejs/plugin-vue";
import path from "path";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("globals"),
        },
      },
    }),
    checker({ vueTsc: true }),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js",
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
  },
});
