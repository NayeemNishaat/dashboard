import { User } from "/src/api/interfaces";
import _Vue from "vue";
// import { PluginObject } from "vue";

const Tawk = {} as any;
Tawk.install = function (app: any, options?: any) {
  app.config.globalProperties.$Tawk = {};
  app.config.globalProperties.$Tawk.$createChat = function () {
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
  app.config.globalProperties.$Tawk.$createChat();
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
  app.config.globalProperties.$Tawk.$updateChatUser = updateUser;

  app.config.globalProperties.$Tawk.$endChat = function () {
    (window as any).Tawk_API.endChat();
  };
  app.config.globalProperties.$Tawk.$hideWidget = function () {
    (window as any).Tawk_API.hideWidget();
  };
  app.config.globalProperties.$Tawk.$showWidget = function () {
    (window as any).Tawk_API.showWidget();
  };
  app.config.globalProperties.$Tawk.$isInit = function () {
    if ((window as any).Tawk_API) {
      return true;
    }
    return false;
  };
};
export default Tawk;
