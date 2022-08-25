import { directive as vClickOutside } from "vue3-click-away";

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(app) {
    app.directive("click-outside", vClickOutside);
  }
};

export default GlobalDirectives;
