import { GetterTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
import {
  PageStatus,
  PageInstallationSettings,
  PageSettings,
} from "@/api/interfaces";
import { defaultHomepageSettings, getPageStatus } from "../settings_helpers";
const getters: GetterTree<ModuleState, RootState> = {
  testMode(state: ModuleState, getters, rootState, rootGetters) {
    const user_ids = rootGetters.client?.web_settings?.testing?.user_ids;
    return Array.isArray(user_ids) && user_ids.length > 0;
  },
  pageStatus(state: ModuleState): PageStatus {
    //page installation settings stores the backend output in the format library:bool, products:bool and banners:bool (home page only)
    //we parse these to return a map of each page type to one of 'checking','found' or 'missing'
    //checking is set when theres a pending http request to the backend to refresh the data
    const pageStatus = getPageStatus("unknown");
    if (state.pageInstallationLoading === "all") {
      return getPageStatus("checking");
    }
    if (
      state.pageInstallationLoading &&
      ["home", "product", "category", "search", "404", "cart"].includes(
        state.pageInstallationLoading
      )
    ) {
      pageStatus[state.pageInstallationLoading] = "checking";
    }
    if (state.pageInstallationSettings) {
      Object.keys(state.pageInstallationSettings).forEach((page) => {
        try {
          //bail if http request is in progress
          if (pageStatus[page] === "checking") {
            return;
          }
          //js library not found, no point checking further
          if (!state.pageInstallationSettings[page].library) {
            return;
          }
          pageStatus[page] =
            state.pageInstallationSettings[page].products == true
              ? "found"
              : "missing";
        } catch (err) {
          pageStatus[page] = "unknown";
        }
      });
      return pageStatus;
    }
    return getPageStatus("unknown");
  },
  pageInstallationSettings(state: ModuleState): PageInstallationSettings {
    return state.pageInstallationSettings;
  },
  installationSettings(state: ModuleState): PageSettings {
    return state.pageInstallationSettings?.home || defaultHomepageSettings;
  }
};

export default getters;
