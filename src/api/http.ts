import { instance as auth } from "@/auth";
import store from "@/store";

export const getHttpApi = (
  baseURL: string
): {
  get: (url: string, headers?: any) => Promise<any>;
  post: (url: string, body: any, headers?: any) => Promise<any>;
} => {
  const get = (url: string, headers: any = {}) => {
    return http(baseURL, url, "GET", null, headers);
  };
  const post = (url: string, data: any, headers: any = {}) => {
    return http(baseURL, url, "GET", data, headers);
  };
  return { get, post };
};

const http = async (
  baseURL: string,
  url: string,
  method: string,
  body: any,
  headers: any = {}
) => {
  if (!("fetch" in window)) {
    throw new Error("browser is too old, fetch is not supported");
  }
  if (!auth) {
    throw new Error("not logged in");
  }
  const claims = await auth.getIdTokenClaims();
  if (!claims) {
    throw new Error("could not get id token");
  }
  const id_token = claims.__raw;
  if (store.getters.apikey) {
    headers["X-Client"] = btoa(store.getters.apikey);
  }

  const options: { method: string; headers: any; body?: any } = {
    method: method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${id_token}`,
      ...headers
    }
  };
  if (method.toUpperCase() !== "GET") {
    if (typeof body === "object") {
      body = JSON.stringify(body);
    }
    options.body = body;
    options.headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  const resp = await fetch(baseURL + url, options);
  return resp.json();
};
