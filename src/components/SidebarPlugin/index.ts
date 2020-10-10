import { App } from "vue";
import { createState } from "./state";
import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";

const SidebarPlugin = {
  install(app: App) {
    app.config.globalProperties.$sidebar = createState();
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
  }
};

export default SidebarPlugin;
