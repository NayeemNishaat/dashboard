// import { PluginObjec } from "vue";
import { User } from "@/api/interfaces";
import _Vue from "vue";

const Segment = {} as any;
Segment.install = function (app: any, options?: any) {
  app.config.globalProperties.$Segment = {};
  app.config.globalProperties.$Segment.$init = function () {
    if (window && (window as any).analytics) {
      (window as any).analytics.load(options.writeKey);
    }
  };
  app.config.globalProperties.$Segment.$init();
  Object.defineProperty(app, "$segment", {
    get() {
      return (window as any).analytics;
    }
  });
  Object.defineProperty(app.config.globalProperties, "$segment", {
    get() {
      return (window as any).analytics;
    }
  });
  app.config.globalProperties.$Segment.$Identify = function (
    id: string,
    user: User
  ) {
    try {
      if (!id || !user.first_name || !user.email) {
        return;
      }
    } catch (err) {
      console.error("invalid user object");
    }
    if (window && (window as any).analytics) {
      (window as any).analytics.identify(id, user);
    }
  };
};
export default Segment;
