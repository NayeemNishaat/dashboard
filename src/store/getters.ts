import { GetterTree } from "vuex";
import { rootState } from "./store_types";
import { instance as auth } from "@/auth";
export const getters: GetterTree<rootState, rootState> = {
  client(state: rootState) {
    if (!state.apikey || Object.keys(state.clients).length === 0) {
      return null;
    }
    return state.clients[state.apikey];
  },
  apikey(state: rootState) {
    return state.apikey;
  },
  nextPage(state: rootState) {
    return state.nextPage;
  },
  isAuthenticated(state: rootState, getters) {
    return getters.client && auth?.state.isAuthenticated;
  },
  hasActiveClients(state: rootState) {
    return Object.keys(state.clients).length > 0;
  },
  clients(state: rootState) {
    return state.clients;
  }
};
