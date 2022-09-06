import { MutationTree } from "vuex";

//interfaces
import { PageInstallationSettings } from "@/api/interfaces";

import ModuleState from "./state";

const mutations: MutationTree<ModuleState> = {
  setPageInstallationSettings(
    state: ModuleState,
    payload: { settings: PageInstallationSettings, page: string }
  ): void {
    if (!payload?.settings || !payload?.page) {
      return;
    }
    if (payload.page === "all") {
      state.pageInstallationSettings = payload.settings;
      return;
    }
    state.pageInstallationSettings[payload.page] = payload.settings[payload.page];
  },
  setPageInstallationLoading(state: ModuleState, page: string): void {
    state.pageInstallationLoading = page;
  }
};
export default mutations;
