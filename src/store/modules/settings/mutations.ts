import { MutationTree } from "vuex";

//interfaces
import { PageInstallationSettings } from "/src/api/interfaces";

import ModuleState from "./state";

const mutations: MutationTree<ModuleState> = {
  setPageInstallationSettings(
    state: ModuleState,
    [payload, page]: [PageInstallationSettings, string]
  ): void {
    if (!payload || !page) {
      return;
    }
    if (page === "all") {
      state.pageInstallationSettings = payload;
      return;
    }
    state.pageInstallationSettings[page] = payload;
  },
  setPageInstallationLoading(state: ModuleState, page: string): void {
    state.pageInstallationLoading = page;
  }
};
export default mutations;
