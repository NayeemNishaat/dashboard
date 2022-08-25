import { FormGroupInput, Card, DropDown } from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app) {
    app.component("fg-input", FormGroupInput);
    app.component("drop-down", DropDown);
    app.component("card", Card);
  }
};

export default GlobalComponents;
