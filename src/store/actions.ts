import { instance as auth } from "@/auth";
import { instance as api } from "@/api";
import { ActionContext, ActionTree } from "vuex";
import { rootState } from "./store_types";

export const actions: ActionTree<rootState, rootState> = {
  fetchClients({ commit, dispatch }: ActionContext<rootState, rootState>) {
    console.log("fetching clients...");
    return new Promise((resolve, reject) => {
      if (!api) {
        reject("api not ready");
        return;
      }
      api
        .getClients()
        .then(response => {
          const clients = response.clients;
          console.log(response);
          commit("setClients", clients);
          if (response.user) {
            commit("setUser", response.user);
          }
          //if only one client, just set that as the current apikey
          if (Object.keys(clients).length === 1) {
            commit("setApikey", Object.keys(clients)[0]);
          }
          resolve();
        })
        .catch((error: unknown) => {
          if (!auth) {
            return;
          }
          console.log(error);
          auth.logout();
          reject(error);
        });
    });
  }
};
