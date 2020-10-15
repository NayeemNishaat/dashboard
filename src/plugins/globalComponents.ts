import { App } from "vue";
import {
  Card,
  StatsCard,
  Button,
  LoaderDots,
  ErrorMsg
} from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app: App): void {
    app.component("stats-card", StatsCard);
    app.component("card", Card);
    app.component("dc-button", Button);
    app.component("loader-dots", LoaderDots);
    app.component("error-msg", ErrorMsg);
  }
};

export default GlobalComponents;
