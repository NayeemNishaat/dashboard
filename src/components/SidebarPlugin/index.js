import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";

// const SidebarStore = {
//   showSidebar: false,
//   sidebarLinks: [],
//   displaySidebar(value) {
//     this.showSidebar = value;
//   }
// };

const SidebarPlugin = {
  install(app) {
    // let app = new Vue({
    //   data: {
    //     sidebarStore: SidebarStore
    //   }
    // });
    const SidebarStore = {
      showSidebar: false,
      sidebarLinks: [],
      displaySidebar(value) {
        this.showSidebar = value;
      }
    };

    app.config.globalProperties.$sidebar = SidebarStore;
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
  }
};

export default SidebarPlugin;
