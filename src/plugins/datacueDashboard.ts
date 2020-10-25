import SideBar from "@/components/SidebarPlugin";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import { createApi, apiSymbol } from "@/api";
import { createAuth, authSymbol } from "@/auth";
import {} from "@/auth";

//css assets
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/sass/datacue/main.scss";
import "@/assets/css/themify-icons.css";
import { App } from "vue";

export default {
  install: (app: App): void => {
    app.use(GlobalComponents);
    app.use(GlobalDirectives);
    app.use(SideBar);
    const baseURL = "http://localhost:8000";
    app.provide(apiSymbol, createApi(baseURL));
    app.provide(
      authSymbol,
      createAuth({
        domain: "datacue-dev.auth0.com",
        client_id: "90kQ7H0ze0tfYWkgd3dub22XrGUYmkms",
        redirect_uri: "http://localhost:8080/logging-in"
      })
    );
  }
};
