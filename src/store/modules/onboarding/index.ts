import State from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const onboarding = {
  namespaced: true,
  state: new State(),
  getters,
  mutations,
  actions
};
export default onboarding;
