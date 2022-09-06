import { ActionContext, ActionTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";

//backend
import { Context, SetupSummary } from "@/api/interfaces";
import { FinishOnboarding, FinishSetup, GetSetupSummary } from "@/api/backend";

const actions: ActionTree<ModuleState, RootState> = {
  fetchSetupSummary({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<SetupSummary> {
    return new Promise((resolve, reject) => {
      GetSetupSummary()
        .then((response) => {
          commit("setSetupSummary", response);
          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },
  finishOnboarding({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<Context> {
    return new Promise((resolve, reject) => {
      FinishOnboarding()
        .then((response) => {
          commit("setContext", response, { root: true });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  finishSetup({
    commit
  }: ActionContext<ModuleState, RootState>): Promise<any> {
    return new Promise((resolve, reject) => {
      FinishSetup()
        .then((response) => {
          commit("setContext", response, { root: true });
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
