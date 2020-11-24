import { rootState } from "./store_types";

export const state: rootState = {
  apikey: localStorage.getItem("dashboard:apikey") || "",
  clients: {},
  user: { name: "", email: "", token: "", is_owner: false, is_partner: false },
  nextPage: null
};
