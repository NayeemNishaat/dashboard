import { ActionContext, ActionTree } from "vuex";
import router from "../router/index";

//i18n
import { i18n, supportedLanguageCodes } from "../lang/lang";

//auth
import { logout } from "../api/AuthService";

import State from "./state";

//interfaces
import { Context, AuthToken } from "../api/interfaces";

//error reporting
import * as Sentry from "@sentry/browser";
import { GetDashboardContext } from "@/api/backend";

// ActionTree<[current state], [root state]>
const actions: ActionTree<State, State> = {
  setAccessToken({ commit }: ActionContext<State, State>, token: AuthToken) {
    commit("setAccessToken", token);
    localStorage.setItem("access_token", JSON.stringify(token));
  },
  setNextPage({ commit }: ActionContext<State, State>, nextPage: string) {
    commit("setNextPage", nextPage);
  },
  logout({ commit, getters }: ActionContext<State, State>) {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("context");

    // clear Sentry user context on log out
    Sentry.configureScope((scope) => {
      scope.setUser({ email: undefined });
    });
    const authProvider = getters?.access_token?.auth_provider || "shopify";
    commit("setAccessToken", { token: "", auth_provider: "" } as AuthToken);
    let url = `${import.meta.env.VITE_APP_URL}/login`;
    if (getters.client.type === "shopify") {
      url = `${import.meta.env.VITE_APP_SHOPIFY_APP_URL}?shop=${getters.apikey
        }`;
    }
    logout(authProvider, url);
  },
  setLanguageCode({ commit }: ActionContext<State, State>, lcode: string) {
    //for now we only support english and spanish
    if (!supportedLanguageCodes.includes(lcode)) {
      lcode = "en";
    }
    commit("setLanguageCode", lcode);
    localStorage.setItem("lang", lcode);
    i18n.global.locale.value = lcode;
    (window as any).locale = lcode;
  },
  setContext(
    { commit, dispatch, getters }: ActionContext<State, State>,
    context: Context
  ) {
    commit("setContext", context);
    localStorage.setItem("context", JSON.stringify(context));
    dispatch("onboarding/fetchSetupSummary");
  },
  setDateRange({ commit }: ActionContext<State, State>, payload: [Date, Date]) {
    commit("setDateRange", payload);
  },
  async getContext({ dispatch }: ActionContext<State, State>) {
    try {
      let context = await GetDashboardContext();
      //skip onboarding if user already has a billing plan selected
      if (context?.subscription?.name && !context?.client?.profile?.has_finished_onboarding) {
        context = await dispatch("onboarding/finishOnboarding");
      }
      await dispatch("setContext", context)
    } catch (error: any) {
      router.push({
        name: "login-failed"
      });
      throw new Error(error)
    };
  }
};

export default actions;
