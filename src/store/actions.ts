import { instance as auth } from "@/auth";
import { instance as api } from "@/api";
import { ActionContext, ActionTree, Commit } from "vuex";
import { rootState } from "./store_types";
import { _ } from "chart.js/dist/chunks";
import { AuthenticatedClients } from "./datacue_types";

const setClientUserFromReponse = (
  response: AuthenticatedClients,
  commit: Commit
) => {
  const clients = response.clients;
  commit("setClients", clients);
  if (response.user) {
    commit("setUser", response.user);
  }
  //if only one client, just set that as the current apikey
  if (Object.keys(clients).length === 1) {
    commit("setApikey", Object.keys(clients)[0]);
  }
};
export const actions: ActionTree<rootState, rootState> = {
  setApikey({ commit }: ActionContext<rootState, rootState>, payload: string) {
    return new Promise(resolve => {
      localStorage.setItem("dashboard:apikey", payload);
      commit("setApikey", payload);
      resolve();
    });
  },
  shopifyLogin({ commit }: ActionContext<rootState, rootState>, token: string) {
    return new Promise((resolve, reject) => {
      if (!api) {
        reject("api not ready");
        return;
      }
      api
        .shopifyLogin(token)
        .then(response => {
          if (!auth) {
            reject("auth not ready");
            return;
          }
          if (!response.shopify_token) {
            reject("missing shopify token");
            return;
          }
          auth.initShopifyAuth(response.shopify_token, response.user);
          setClientUserFromReponse(response, commit);
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },
  fetchClients({ commit }: ActionContext<rootState, rootState>) {
    return new Promise((resolve, reject) => {
      if (!api) {
        reject("api not ready");
        return;
      }
      api
        .getClients()
        .then(response => {
          setClientUserFromReponse(response, commit);
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
