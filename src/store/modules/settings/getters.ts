import { GetterTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
import {
  PageStatus,
  PageInstallationSettings,
  HomepageSettings,
  Locale
} from "/src/api/interfaces";
import { defaultHomepageSettings, getPageStatus } from "../settings_helpers";
const getters: GetterTree<ModuleState, RootState> = {
  profile(state: ModuleState, getters, rootState, rootGetters) {
    return rootGetters.client.profile;
  },
  testMode(state: ModuleState, getters) {
    return !!(
      (getters.webSettings &&
        getters.webSettings.testing &&
        getters.webSettings.testing.user_ids &&
        getters.webSettings.testing.user_ids.length > 0) ||
      false
    );
  },
  webSettings(state: ModuleState, getters, rootState, rootGetters) {
    return rootGetters.client.web_settings;
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
  installationSettings(state: ModuleState): HomepageSettings {
    return (
      (state.pageInstallationSettings && state.pageInstallationSettings.home) ||
      defaultHomepageSettings
    );
  },
  locale(state: ModuleState, getters, rootState, rootGetters): string {
    let locale = rootGetters.client.profile.locale as Locale;
    if (!locale?.language) {
      locale = getters.webSettings?.recommendations?.all;
    }
    const lang = locale?.language || "en";
    const country = locale?.country || "US";
    return `${lang}-${country}`;
  }
};

export default getters;
