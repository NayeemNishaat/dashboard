import { ActionContext, ActionTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
//backend
import { GetPageInstallationSettings, GetSettings, SaveSettings } from "@/api/backend";
import { ClientSettings, ClientSettingsUpdate, PageInstallationSettings } from "@/api/interfaces";

const actions: ActionTree<ModuleState, RootState> = {
  getPageInstallationSettings(
    { commit }: ActionContext<ModuleState, RootState>,
    page: string
  ): Promise<PageInstallationSettings> {
    commit("setPageInstallationLoading", page);
    return new Promise((resolve, reject) => {
      GetPageInstallationSettings(page)
        .then((response) => {
          commit("setPageInstallationSettings", { settings: response, page });
          resolve(response);
        })
        .catch((error) => reject(error.response))
        .finally(() => commit("setPageInstallationLoading", null));
    });
  },
  saveSettings(
    { commit, dispatch }: ActionContext<ModuleState, RootState>,
    payload: ClientSettingsUpdate
  ): Promise<ClientSettings> {
    return new Promise((resolve, reject) => {
      SaveSettings(payload)
        .then((response) => {
          dispatch("setSettings", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getSettings({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<any> {
    return new Promise((resolve, reject) => {
      GetSettings()
        .then((response) => {
          commit("updateClientSettings", response, { root: true });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  }
};
export default actions;
