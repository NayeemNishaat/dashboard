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
    const baseURL = `${process.env.VUE_APP_BACKEND_URL}`;
    app.provide(apiSymbol, createApi(baseURL));
    app.provide(
      authSymbol,
      createAuth({
        domain: `${process.env.VUE_APP_AUTH_DOMAIN}`,
        client_id: `${process.env.VUE_APP_AUTH_CLIENTID}`,
        redirect_uri: `${process.env.VUE_APP_URL}/logging-in`
      })
    );
  }
};
