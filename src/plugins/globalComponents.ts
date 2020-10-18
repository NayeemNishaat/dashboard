import { App } from "vue";
import {
  Card,
  StatsCard,
  ChartCard,
  Button,
  LoaderDots,
  ErrorMsg,
  SuspenseWithError
} from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app: App): void {
    app.component("stats-card", StatsCard);
    app.component("chart-card", ChartCard);
    app.component("card", Card);
    app.component("dc-button", Button);
    app.component("loader-dots", LoaderDots);
    app.component("error-msg", ErrorMsg);
    app.component("SuspenseWithError", SuspenseWithError);
  }
};

export default GlobalComponents;
