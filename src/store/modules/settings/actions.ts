import { ActionContext, ActionTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
//backend
import { Http } from "../../../http";

const actions: ActionTree<ModuleState, RootState> = {
  setSettings: ({ commit }: ActionContext<ModuleState, RootState>, data) => {
    // Update the settings value in the client state
    commit("updateClientSettings", data, { root: true });
  },
  getSettings({ commit, dispatch }: ActionContext<ModuleState, RootState>) {
    return new Promise((resolve, reject) => {
      Http.get("settings")
        .then((response) => {
          dispatch("setSettings", response.data);
          resolve(response.data);
        })
        .catch((error) => reject(error));
    });
  },
  getPageInstallationSettings(
    { commit }: ActionContext<ModuleState, RootState>,
    page
  ): Promise<any> {
    commit("setPageInstallationLoading", page);
    return new Promise((resolve, reject) => {
      Http.get("settings/installation/" + page)
        .then((response) => {
          commit("setPageInstallationSettings", [response.data, page]);
          resolve(response.data);
        })
        .catch((error) => reject(error.response))
        .finally(() => commit("setPageInstallationLoading", null));
    });
  },
  saveSettings(
    { commit, dispatch }: ActionContext<ModuleState, RootState>,
    payload
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Http.post("settings", payload)
        .then((response) => {
          dispatch("setSettings", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getWebSettings({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<any> {
    return new Promise((resolve, reject) => {
      Http.get("settings/web")
        .then((response) => {
          const data = {};
          data["web_settings"] = response.data;
          commit("updateClientSettings", data, { root: true });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  }
};
export default actions;
