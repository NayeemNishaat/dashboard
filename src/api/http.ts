import { instance as auth } from "@/auth";
import store from "@/store";

export const getHttpApi = (
  base_url: string
): {
  get: (url: string, headers?: any, with_token?: boolean) => Promise<any>;
  post: (
    url: string,
    body: any,
    headers?: any,
    with_token?: boolean
  ) => Promise<any>;
} => {
  const get = (url: string, headers: any = {}, with_token = true) => {
    return http(base_url, url, "GET", null, headers, with_token);
  };
  const post = (
    url: string,
    data: any,
    headers: any = {},
    with_token = true
  ) => {
    return http(base_url, url, "POST", data, headers, with_token);
  };
  return { get, post };
};

const http = async (
  baseURL: string,
  url: string,
  method: string,
  body: any,
  headers: any = {},
  with_token = true
) => {
  if (!("fetch" in window)) {
    throw new Error("browser is too old, fetch is not supported");
  }
  if (!auth) {
    throw new Error("not logged in");
  }
  let authHeader = {};
  if (with_token) {
    const token = (await auth.getIdToken()) || "";
    if (!token) {
      throw new Error("could not get id token");
    }
    authHeader = { Authorization: `Bearer ${token}` };
  }
  if (store.getters.apikey) {
    headers["X-Client"] = btoa(store.getters.apikey);
  }

  const options: { method: string; headers: any; body?: any } = {
    method: method,
    headers: {
      Accept: "application/json",
      ...authHeader,
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
