import { ActionContext, ActionTree } from "vuex";
import router from "@/router/index";
//backend
import { Http } from "@/http";

//i18n
import { i18n, supportedLanguageCodes } from "@/lang/lang";

//auth
import { logout } from "@/api/AuthService";

import State from "./state";

//interfaces
import { Context, AuthToken } from "@/api/interfaces";

//error reporting
import * as Sentry from "@sentry/browser";

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
    Sentry.configureScope(scope => {
      scope.setUser({ email: undefined });
    });
    const authProvider = getters?.access_token?.auth_provider || "shopify";
    commit("setAccessToken", { token: "", auth_provider: "" } as AuthToken);
    let url = `${import.meta.env.VITE_APP_URL}/login`;
    if (getters.client.type === "shopify") {
      url = `${import.meta.env.VITE_APP_SHOPIFY_APP_URL}?shop=${getters.apikey}`
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
    i18n.locale = lcode;
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
  getContext({ commit, dispatch }: ActionContext<State, State>) {
    const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
    return new Promise((resolve, reject) => {
      Http.get(`${BACKEND_URL}/login`)
        .then((response: { data: Context }) => {
          if (!response.data.client.apikey) {
            router.push({
              name: "login-failed"
            });
            reject("invalid context");
          }
          dispatch("setContext", response.data);
          resolve(response.data);
        })
        .catch((error: { response: any }) => {
          router.push({
            name: "login-failed"
          });
          reject(error.response);
        });
    });
  }
};

export default actions;
