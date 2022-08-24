import axios from "axios";
// import Vue from "vue";
import TinyEmitter from "tiny-emitter";
import * as Sentry from "@sentry/browser";

import store from "../store";
import router from "../router/index";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const API_VERSION = "v1";
const BUS = new TinyEmitter();

export const Http = axios.create({
  baseURL: `${BACKEND_URL}/${API_VERSION}`,
  timeout: 8000
});

Http.interceptors.request.use(
  function (config) {
    const token = store?.getters?.accessToken?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers["X-APP"] = "dashboard";
    }
    const apikey = store?.getters?.context?.client?.apikey;
    if (apikey) {
      config.headers["X-Client"] = window.btoa(apikey);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

Http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      BUS.emit("errors:401");
      return Promise.reject(new Error("token expired"));
    }
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

BUS.on("errors:401", () => {
  store.dispatch("logout").then(() => {
    router.push({ name: "login" });
  });
});
