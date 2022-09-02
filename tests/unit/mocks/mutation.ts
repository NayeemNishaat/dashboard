import { MutationTree } from "vuex";

import {
  WebSettings,
  AuthToken,
  Context,
  AlgoSettings,
  ClientProfile
} from "@/api/interfaces";

import State from "./state";

const mutations: MutationTree<State> = {
  setDateRange(state: State, newrange: any): void {
    state.dateRange = newrange;
  },
  setAccessToken(state: State, token: AuthToken): void {
    state.accessToken = token;
  },
  setLanguageCode(state: State, lcode: string): void {
    state.languageCode = lcode;
  },
  setNextPage(state: State, nextPage: string): void {
    state.nextPage = nextPage;
  },
  setContext(state: State, context: Context): void {
    state.context = context;
  },
  updateClientSettings(
    state: State,
    payload: {
      web_settings: WebSettings;
      algo_settings: AlgoSettings;
      profile: ClientProfile;
    }
  ): void {
    if (!state.context?.client.apikey) {
      return;
    }
    const context = state.context;
    context.client = Object.assign({}, context.client, payload);
    state.context = context;
  }
};
export default mutations;
