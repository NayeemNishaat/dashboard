import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import PaperDashboard from "./plugins/paperDashboard";
import "./registerServiceWorker";
import store from "./store";

/* eslint-disable no-new */
createApp(App)
  .use(router)
  .use(store)
  .use(PaperDashboard)
  .mount("#app");
