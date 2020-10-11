import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import DataCueDashboard from "./plugins/datacueDashboard";
import "./registerServiceWorker";
import store from "./store";

/* eslint-disable no-new */
createApp(App)
  .use(router)
  .use(store)
  .use(DataCueDashboard)
  .mount("#app");
