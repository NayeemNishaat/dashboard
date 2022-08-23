// import Vue from "vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
// import VueCompositionAPI from "@vue/composition-api";

import LoadScript from "vue-plugin-load-script";
import Clipboard from "v-clipboard";
import DataCueDashboard from "./plugins/datacueComponents";
import Tawk from "@/plugins/tawk";
// import Segment from "@/plugins/segment";

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
// vuex setup
import store from "@/store/index";

const app = createApp(App as any);

const sentryDSN = import.meta.env.VITE_APP_SENTRY_DSN;
if (sentryDSN) {
  Sentry.init({
    app,
    dsn: sentryDSN,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: [`${import.meta.env.VITE_APP_URL}`.split("//")[1]]
      })
    ],
    beforeSend: (event) => {
      const user = { id: "", email: "" };
      try {
        user.email = store.getters.user.email;
        user.id = store.getters.apikey;
      } catch {
        if (!user.id && !user.email) {
          //nothing to do here
          return event;
        }
      }
      if (!event.user) {
        event.user = user;
      }
      if (!event.user.id) {
        event.user.id = user.id;
      }
      if (!event.user.email) {
        event.user.email = user.email;
      }
      return event;
      //   // Check if it is an exception -> Show report dialog
      //   event.exception && Sentry.showReportDialog();
      //   return event;
    }
  });
}

// Element and Vue i18n setup
import { i18n } from "./lang/lang";
import ElementPlus from "element-plus";

// createApp(App).mount("#app");

app.use(ElementPlus, {
  i18n
  // i18n: (key: string, value: string) => i18n.t(key, value)
});

app.use(DataCueDashboard);
app.use(Clipboard);
app.use(LoadScript);
// Vue.use(VueCompositionAPI);
app.use(Tawk, {
  tawkSrc: "https://embed.tawk.to/5e93512169e9320caac2dc1e/default"
});
// Vue.use(Segment, {
//   writeKey: "PJc2vKobVgVMXUKZZctaGH4aDyo8zk1D"
// });

// app.config.productionTip = false;

/* eslint-disable no-new */
app.use(i18n);
app.use(router);
app.use(store);
app.mount("#app");
