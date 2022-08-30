import { MutationTree } from "vuex";

//interfaces
import { SetupSummary } from "@/api/interfaces";

import ModuleState from "./state";

const mutations: MutationTree<ModuleState> = {
  setSetupSummary(state: ModuleState, payload: SetupSummary): void {
    state.setupSummary = payload;
  },
  setIntroStep(state: ModuleState, payload: number): void {
    state.introStep = payload;
  },
  setSetupStep(state: ModuleState, payload: number): void {
    state.setupStep = payload;
  }
};
export default mutations;
