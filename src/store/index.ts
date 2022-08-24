// import { app } from "/src/main";
import { createStore } from "vuex";

// modules
import onboarding from "./modules/onboarding";
import settings from "./modules/settings";

//root store
import State from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

// app.use(Vuex as any);

// configure Vuex
export default createStore({
  modules: {
    onboarding,
    settings
  },
  state: new State(),
  getters,
  mutations,
  actions
});
