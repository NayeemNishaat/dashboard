import { AuthenticatedClients, Clients } from "@/store/datacue_types";
import { inject } from "vue";
import { getHttpApi } from "./http";
import { summary, segments, segment, datacueApi } from "./interfaces";

export const apiSymbol = Symbol("datacue-api");

export let instance: datacueApi | undefined;

export const getApi = (): datacueApi => {
  const api: datacueApi | undefined = inject(apiSymbol);
  if (!api) {
    throw new Error("could not load api");
  }
  return api;
};
export const createApi = (baseURL: string): datacueApi => {
  if (instance) {
    return instance;
  }
  const http = getHttpApi(baseURL);
  const getSummary = async (clientId: string): Promise<summary> => {
    return await http.get("/ads/summary");
  };
  const getSegments = (clientId: string): Promise<segments> => {
    return http.get("/ads/segments");
  };
  const getSegment = (
    clientId: string,
    segmentId: string
  ): Promise<segment> => {
    return http.get(`/ads/segments/${segmentId}`);
  };
  const handleShopifyAuthentication = (): Promise<any> => {
    const token = window.location.hash.replace(/^#/, "");

    return http.post(
      "/client/shopify-login",
      { token },
      { "X-APP": "dashboard" }
    );
  };
  const getClients = (): Promise<AuthenticatedClients> => {
    return http.get("/clients");
  };
  instance = {
    getClients,
    getSummary,
    getSegments,
    getSegment,
    handleShopifyAuthentication
  };
  return instance;
};
