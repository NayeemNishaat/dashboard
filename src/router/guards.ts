import { instance as auth } from "@/auth";
import { NavigationGuard } from "vue-router";
import store from "@/store";

function isLoggedIn() {
  //authenticated by auth0
  return auth?.isAuthenticated() ?? false;
}
function isAuthenticated() {
  //authorized by our api
  return store.getters.isAuthenticated ?? false;
}

export const ifNotAuthenticated: NavigationGuard = (to, from, next) => {
  if (!isLoggedIn()) {
    next();
    return;
  }
  next("/");
};

export const ifAuthenticated: NavigationGuard = (to, from, next) => {
  if (isAuthenticated()) {
    next();
    return;
  } else if (isLoggedIn()) {
    next("loading");
    return;
  }
  next("login");
};
