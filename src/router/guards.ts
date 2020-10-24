import { instance as auth } from "@/auth";
import { NavigationGuard } from "vue-router";

function isLoggedIn() {
  return auth?.state?.isAuthenticated ?? false;
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
