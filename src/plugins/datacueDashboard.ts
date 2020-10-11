import SideBar from "@/components/SidebarPlugin";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";

//css assets
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/sass/paper-dashboard.scss";
import "@/assets/sass/datacue/main.scss";
import "@/assets/css/themify-icons.css";
import { App } from "vue";

export default {
  install: (app: App): void => {
    app.use(GlobalComponents);
    app.use(GlobalDirectives);

    app.use(SideBar);
  }
};
