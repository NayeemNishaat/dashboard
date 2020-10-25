import { rootState } from "./store_types";

export const state: rootState = {
  apikey: "",
  clients: {},
  user: { name: "", email: "", token: "" },
  nextPage: null
};
