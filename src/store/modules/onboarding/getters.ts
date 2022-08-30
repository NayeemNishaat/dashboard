import { GetterTree } from "vuex";
import ModuleState from "./state";
import RootState from "../../state";
import {
  OnboardingCompletionStatus,
  HomepageSettings,
  WebSettings,
  Context
} from "@/api/interfaces";

const getters: GetterTree<ModuleState, RootState> = {
  setupSummary(
    state: ModuleState,
    getters,
    rootState,
    rootGetters
  ): OnboardingCompletionStatus {
    const mainBannersExpected = 2;
    const subBannersExpected = 5;
    const ordersExpected = 50;
    const setupSummary = state.setupSummary;
    const webSettings = rootGetters["settings/webSettings"] as WebSettings;
    const homePageInstallationSettings = rootGetters[
      "settings/installationSettings"
    ] as HomepageSettings;
    const context = rootGetters["context"] as Context;
    const hasProductsAndCategories =
      setupSummary?.store_data?.has_products_categories;
    const main =
      (Math.min(setupSummary?.banners_uploaded?.main ?? 0, 2) / 2) * 100;
    const sub =
      (Math.min(setupSummary?.banners_uploaded?.sub ?? 0, 5) / 5) * 100;
    const customStyles =
      webSettings?.recommendations?.products?.custom_styles ?? null;
    const numOrders = setupSummary?.store_data?.orders ?? 0;
    return {
      hasSelectedPlan: !!context?.subscription?.name,
      recommendationsReady: setupSummary?.algo_completed?.products ?? false,
      storeData: {
        productsAndCategories: hasProductsAndCategories,
        orders: {
          done: numOrders > ordersExpected,
          num: numOrders,
          expected: ordersExpected
        }
      },
      bannerSectionFound: homePageInstallationSettings.banners,
      bannersUploaded: {
        done: main >= mainBannersExpected && sub >= subBannersExpected,
        main: {
          count: main,
          expected: mainBannersExpected
        },
        sub: {
          count: sub,
          expected: subBannersExpected
        }
      },
      productSectionFound: homePageInstallationSettings.products,
      productSectionDesigned:
        !!customStyles &&
        !!Object.keys(customStyles).reduce((acc, curField) => {
          if (acc) {
            return "true";
          }
          if (customStyles[curField]["active"]) {
            return "true";
          }
          return "";
        }, "")
    };
  },
  introStep(state: ModuleState): number {
    return state.introStep;
  },
  setupStep(state: ModuleState): number {
    return state.setupStep;
  },
  numberOfSteps(state: ModuleState, getters): number {
    return getters.stepsKeys.length;
  },
  stepsKeys(state: ModuleState, getters): Array<string> {
    if (!getters.setupSummary) {
      return [];
    }
    return Object.keys(getters.setupSummary);
  },
  finishedSteps(state: ModuleState, getters): number {
    return getters.stepsKeys
      .map((elem) => {
        let step = getters.setupSummary[elem];
        switch (elem) {
          case "bannersUploaded":
            step = step.done;
            break;
          case "storeData":
            step = step.productsAndCategories && step.orders.done;
            break;
        }
        return step ? 1 : 0;
      })
      .reduce((acc: any, cur: any) => acc + cur);
  },
  hasFinishedOnboarding(
    state: ModuleState,
    getters,
    rootState,
    rootGetters
  ): boolean {
    const context = rootGetters["context"] as Context;
    const profile = context.client.profile;
    return (profile && profile.has_finished_onboarding) || false;
  },
  hasFinishedSetup(
    state: ModuleState,
    getters,
    rootState,
    rootGetters
  ): boolean {
    const context = rootGetters["context"] as Context;
    const profile = context?.client?.profile;
    return (
      (profile && profile.has_finished_setup) ||
      getters.finishedSteps === getters.numberOfSteps
    );
  }
};

export default getters;
