import { ActionContext, ActionTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
// import Vue from "vue";
//backend
import { Http } from "@/http";
import { AuthToken, SetupSummary } from "@/api/interfaces";

const actions: ActionTree<ModuleState, RootState> = {
  setAccessToken(
    { commit, dispatch }: ActionContext<ModuleState, RootState>,
    token: AuthToken
  ) {
    dispatch("setAccessToken", token, { root: true });
  },
  fetchSetupSummary({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<{ data: SetupSummary }> {
    return new Promise((resolve, reject) => {
      Http.get("/summary/setup")
        .then((response) => {
          commit("setSetupSummary", response.data);
          resolve(response.data);
        })
        .catch((error) => reject(error.response));
    });
  },
  finishOnboarding({
    dispatch
  }: ActionContext<ModuleState, RootState>): Promise<any> {
    return new Promise((resolve, reject) => {
      Http.post("client/finish-onboarding")
        .then((resp) => {
          dispatch("getContext", resp, { root: true })
            .then(() => {
              resolve(resp);
            })
            .catch(() => {
              reject(new Error("could not update store"));
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  finishSetup({
    rootGetters
  }: ActionContext<ModuleState, RootState>): Promise<any> {
    const client = rootGetters.client;
    client.profile["has_finished_setup"] = true;
    // Vue.set(client.profile, "has_finished_setup", true);
    return new Promise((resolve, reject) => {
      Http.post("/client/finish-setup")
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
  setIntroStep(
    { commit }: ActionContext<ModuleState, RootState>,
    step: number
  ) {
    if (step >= 0 && step <= 5) {
      commit("setIntroStep", step);
    }
  },
  setSetupStep({ commit }: ActionContext<ModuleState, RootState>, step) {
    if (step >= 0 && step <= 2) {
      commit("setSetupStep", step);
    }
  }
};
export default actions;
