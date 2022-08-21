import { GetterTree } from "vuex";
import { Client, User, Subscription, AuthToken, Context } from "@/api/interfaces";
import { isTokenExpired } from "@/api/AuthService";
import State from "./state";

// GetterTree<[current state], [root state]>
const getters: GetterTree<State, State> = {
  dateRange(state: State): [string, string] {
    return state.dateRange;
  },
  accessToken(state: State): AuthToken {
    return state.accessToken;
  },
  isLoggedIn(state: State): boolean | null {
    return !!state.accessToken?.token && !isTokenExpired(state.accessToken?.token);
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
    return getters?.client?.type === "shopify"
  },
  subscription(state: State, getters): Subscription {
    return state.context?.subscription || {} as Subscription;
  },
};

export default getters;
