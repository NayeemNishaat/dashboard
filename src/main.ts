import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import DataCueDashboard from "./plugins/datacueDashboard";
import "./registerServiceWorker";

/* eslint-disable no-new */
createApp(App)
  .use(router)
  .use(store)
  .use(DataCueDashboard)
  .mount("#app");
