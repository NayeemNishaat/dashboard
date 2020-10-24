import { App } from "vue";
import { createSidebar, sidebarSymbol } from "./state";
import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";

const SidebarPlugin = {
  install(app: App) {
    app.provide(sidebarSymbol, createSidebar());
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
  }
};

export default SidebarPlugin;
