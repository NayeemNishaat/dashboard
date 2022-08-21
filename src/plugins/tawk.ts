import { User } from "@/api/interfaces";
import _Vue from "vue";
import { PluginObject } from "vue";

const Tawk = {} as PluginObject<any>;
Tawk.install = function (Vue: typeof _Vue, options?: any) {
  Vue.prototype.$Tawk = {};
  Vue.prototype.$Tawk.$createChat = function () {
    const Tawk_API = {};
    // const Tawk_LoadStart = new Date();
    const s1 = document.createElement("script") as HTMLScriptElement;
    const s0 = document.getElementsByTagName("script")[0] as HTMLElement;
    s1.async = true;
    s1.src = options.tawkSrc;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
    (window as any).Tawk_API = Tawk_API;
  };
  Vue.prototype.$Tawk.$createChat();
  const updateUser = function (user: User, token: string) {
    try {
      if (!user || !user.first_name || !user.email || !token) {
        return;
      }
    } catch (err) {
      console.error("invalid user object");
    }
    const tawkFunc = (window as any)?.Tawk_API?.setAttributes ?? null;
    if (typeof tawkFunc === "function") {
      tawkFunc({
        name: user.first_name || user.last_name,
        email: user.email,
        hash: token
      });
      return;
    }
    //tawk is not ready yet, try again in 2 seconds
    setTimeout(() => {
      updateUser(user, token);
    }, 2000);
  };
  Vue.prototype.$Tawk.$updateChatUser = updateUser;

  Vue.prototype.$Tawk.$endChat = function () {
    (window as any).Tawk_API.endChat();
  };
  Vue.prototype.$Tawk.$hideWidget = function () {
    (window as any).Tawk_API.hideWidget();
  };
  Vue.prototype.$Tawk.$showWidget = function () {
    (window as any).Tawk_API.showWidget();
  };
  Vue.prototype.$Tawk.$isInit = function () {
    if ((window as any).Tawk_API) {
      return true;
    }
    return false;
  };
};
export default Tawk;
