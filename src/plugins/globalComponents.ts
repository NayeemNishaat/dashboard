import { App } from "vue";
import { Card, StatsCard, Button } from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app: App): void {
    app.component("stats-card", StatsCard);
    app.component("card", Card);
    app.component("dc-button", Button);
  }
};

export default GlobalComponents;
