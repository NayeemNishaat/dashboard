import { App } from "vue";
import {
  Button,
  Card,
  ChartCard,
  DropDown,
  ErrorMsg,
  Loading,
  StatsCard,
  SuspenseWithError
} from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app: App): void {
    app.component("stats-card", StatsCard);
    app.component("chart-card", ChartCard);
    app.component("drop-down", DropDown);
    app.component("card", Card);
    app.component("dc-button", Button);
    app.component("loading", Loading);
    app.component("error-msg", ErrorMsg);
    app.component("SuspenseWithError", SuspenseWithError);
  }
};

export default GlobalComponents;
