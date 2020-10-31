import { rootState } from "./store_types";

export const state: rootState = {
  apikey: localStorage.getItem("dashboard:apikey") || "",
  clients: {},
  user: { name: "", email: "", token: "" },
  nextPage: null
};
