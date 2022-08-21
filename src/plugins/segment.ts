import { PluginObject } from "vue";
import { User } from "@/api/interfaces";
import _Vue from "vue";

const Segment = {} as PluginObject<any>;
Segment.install = function (Vue: typeof _Vue, options?: any) {
  Vue.prototype.$Segment = {};
  Vue.prototype.$Segment.$init = function () {
    if (window && (window as any).analytics) {
      (window as any).analytics.load(options.writeKey);
    }
  };
  Vue.prototype.$Segment.$init();
  Object.defineProperty(Vue, "$segment", {
    get() {
      return (window as any).analytics;
    }
  });
  Object.defineProperty(Vue.prototype, "$segment", {
    get() {
      return (window as any).analytics;
    }
  });
  Vue.prototype.$Segment.$Identify = function (id: string, user: User) {
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
