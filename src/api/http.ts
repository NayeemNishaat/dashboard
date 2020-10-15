export const getHttpApi = (
  baseURL: string
): {
  get: (url: string) => Promise<any>;
  post: (url: string, body: any) => Promise<any>;
} => {
  const get = (url: string) => {
    return http(baseURL, url, "GET", null);
  };
  const post = (url: string, data: any) => {
    return http(baseURL, url, "GET", data);
  };
  return { get, post };
};

const http = async (
  baseURL: string,
  url: string,
  method: string,
  body: any
) => {
  if (!("fetch" in window)) {
    throw new Error("browser is too old, fetch is not supported");
  }
  const options: { method: string; headers: any; body?: any } = {
    method: method,
    headers: { Accept: "application/json" }
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
