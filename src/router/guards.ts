import multiguard from "vue-router-multiguard";
import { NavigationGuard } from "vue-router";
import store from "../store/index";

function isLoggedIn() {
  return store.getters.isLoggedIn;
}

function hasFinishedOnboarding() {
  return store.getters["onboarding/hasFinishedOnboarding"];
}

function hasFinishedSetup() {
  return store.getters["onboarding/hasFinishedSetup"];
}

export const ifNotAuthenticated: NavigationGuard = (to, from, next) => {
  if (!isLoggedIn()) {
    next();
    return;
  }
  next("/");
};

export const ifAuthenticated: NavigationGuard = (to, from, next) => {
  if (isLoggedIn()) {
    next();
    return;
  }
  next("/login");
};

export const ifFinishedOnboarding: NavigationGuard = async (to, from, next) => {
  if (isLoggedIn()) {
    const profile = store.getters?.client?.profile;
    if (!profile) {
      await store.dispatch("setNextPage", to);
      next({ name: "loading" });
      return;
    }
    if (hasFinishedOnboarding()) {
      if (hasFinishedSetup() && to.name == "setup-summary") {
        next({ name: "summary" });
        return;
      }
      next();
      return;
    }
    next({ name: "onboarding" });
    return;
  }
  next({ name: "login" });
};

export const ifOnboarding: NavigationGuard = (to, from, next) => {
  if (store.getters["onboarding/hasFinishedOnboarding"]) {
    next({ name: "summary" });
    return;
  }
  if (isLoggedIn() && to.name === "onboarding-signup") {
    next({ name: "onboarding", params: to.params });
  }
  next();
};

export const ifHasFeatureAccess = (feature: string) =>
  multiguard([
    ifFinishedOnboarding,
    (to, from, next) => {
      const clientAccess = store.getters?.subscription?.access?.personalization;

      if (clientAccess && clientAccess[feature]) {
        next();
        return;
      }

      if (to.fullPath.endsWith("/upgrade")) {
        next();
        return;
      }

      next({ name: `${feature} unavailable` });
    }
  ]);
