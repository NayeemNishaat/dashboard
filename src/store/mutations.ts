import { MutationTree } from "vuex";
import { Clients, User } from "./datacue_types";
import { rootState } from "./store_types";

export const mutations: MutationTree<rootState> = {
  setApikey(state: rootState, apikey: string) {
    state.apikey = apikey;
  },
  setClients(state: rootState, clients: Clients) {
    state.clients = clients;
  },
  setUser(state: rootState, user: User) {
    state.user = user;
  }
};
