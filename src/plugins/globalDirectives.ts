import directive from "./v-click-outside";
import { App } from "vue";

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(app: App): void {
    app.directive("click-outside", directive);
  }
};

export default GlobalDirectives;
