import { instance as auth } from "@/auth";
import { NavigationGuard } from "vue-router";
import store from "@/store";

function isLoggedIn() {
  //authenticated
  return auth?.isAuthenticated() ?? false;
}

function isAuthenticated() {
  //authorized by our api
  return store.getters.isAuthenticated || false;
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
    next({ name: "authorizing" });
    return;
  }
  next({ name: "login" });
};

export const ifLoggedIn: NavigationGuard = (to, from, next) => {
  if (isLoggedIn()) {
    next();
    return;
  }
  next({ name: "login" });
};
