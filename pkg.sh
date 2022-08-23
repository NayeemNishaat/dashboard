{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "description": "The main DataCue dashboard where clients can manage their personalization campaigns.",
  "author": "Shahram Anver <shahram@datacue.co>",
  "scripts": {
    "serve": "vite --open --mode development",
    "preview": "vite preview --open --port 8080",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "build:master": "vite build --out-dir dist --mode production",
    "build:staging": "vite build --out-dir dist --mode staging",
    "deploy:master": "bash deploy.sh",
    "deploy:staging": "bash deploy.sh staging"
  },
  "dependencies": {
    "@sentry/tracing": "^6.13.3",
    "@sentry/vue": "^6.13.3",
    # "@vue/composition-api": "^1.2.4", # vue
    "auth0-js": "^9.16.4",
    "axios": "^0.19.2",
    "bootstrap": "^4.6.0",
    "browser-image-size": "^1.1.0",
    "chart.js": "^2.9.4",
    "color": "^3.2.1",
    "core-js": "^3.18.2",
    "date-fns": "^2.25.0",
    "dropzone": "^5.9.3",
    # "element-ui": "^2.15.9", # element-plus
    "es6-promise": "^4.2.4",
    "jwt-decode": "^2.2.0",
    # "mjml4-in-browser": "^1.0.2", # Vulnerable
    "stylus": "^0.54.8",
    "stylus-loader": "^3.0.2",
    "v-clipboard": "^2.2.3",
    "vue": "^2.7.9",
    "vue-chartjs": "^3.5.1",
    # "vue-clickaway": "^2.1.0", # vue3-click-away
    "vue-i18n": "^8.26.5",
    "vue-password-strength-meter": "^1.7.2",
    "vue-plugin-load-script": "^1.3.4",
    "vue-router": "^3.5.2",
    "vue-router-multiguard": "^1.0.3",
    "vuex": "^3.6.2",
    "zxcvbn": "^4.4.2"
  },
  "devDependencies": {
    "@types/auth0-js": "^9.14.5",
    "@types/jwt-decode": "^2.2.1",
    "@typescript-eslint/eslint-plugin": "^3.10.1",
    "@typescript-eslint/parser": "^3.10.1",
    "@vue/compiler-sfc": "^3.2.37",
    "sass": "^1.54.5",
    "typescript": "^3.9.10",
    "vite": "^3.0.9",
    # "vite-plugin-vue2": "^2.0.2", # @vitejs/plugin-vue
    "vue-loader": "^17.0.0",
    "vue-svg-inline-loader": "^1.5.1",
    # "vue-template-compiler": "^2.6.14" # Not required
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ],
  "engines": {
    "node": ">= 8.1.4",
    "npm": ">= 5.0.0"
  }
}
######
{
  "name": "vite-vue-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.37"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^3.0.3",
    "typescript": "^4.6.4",
    "vite": "^3.0.9",
    "vue-tsc": "^0.40.1"
  }
}
##############
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})