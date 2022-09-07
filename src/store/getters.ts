import { GetterTree } from "vuex";
import {
  Client,
  User,
  AuthToken,
  Context,
  Locale
} from "../api/interfaces";
import { isTokenExpired } from "../api/AuthService";
import State from "./state";
import { ClientSubscriptionAccess } from "@/api/billing_interfaces";

// GetterTree<[current state], [root state]>
const getters: GetterTree<State, State> = {
  dateRange(state: State): [string, string] {
    return state.dateRange;
  },
  accessToken(state: State): AuthToken {
    return state.accessToken;
  },
  isLoggedIn(state: State): boolean | null {
    return (
      !!state.accessToken?.token && !isTokenExpired(state.accessToken?.token)
    );
  },
  languageCode(state: State): string {
    return state.languageCode;
  },
  user(state: State): User {
    return state.context?.user || ({} as User);
  },
  client(state: State): Client {
    return state.context?.client || ({} as Client);
  },
  context(state: State): Context {
    return state.context || ({} as Context);
  },
  nextPage(state: State): string | null {
    return state.nextPage;
  },
  apikey(state: State): string {
    return state.context?.client?.apikey || "";
  },
  trustedClient(state: State, getters): boolean {
    return getters?.client?.type === "shopify";
  },
  subscription(state: State, getters): ClientSubscriptionAccess {
    return state.context?.subscription || ({} as ClientSubscriptionAccess);
  },
  locale(state: State, getters): string {
    let locale = getters.client.profile.locale as Locale;
    if (!locale?.language) {
      locale = getters.client?.web_settings?.recommendations?.all;
    }
    const lang = locale?.language || "en";
    const country = locale?.country || "US";
    return `${lang}-${country}`;
  }
};

export default getters;
