import { AuthenticatedClients } from "@/store/datacue_types";
import { inject } from "vue";
import { getHttpApi } from "./http";
import {
  overview,
  segmentRecommendations,
  segment,
  datacueApi,
  productTypeGroup
} from "./interfaces";

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
  const getOverview = async (): Promise<overview> => {
    return await http.get("/segments/overview");
  };
  const getSegments = async (): Promise<segmentRecommendations> => {
    const data = await http.get("/segments/recommendations");
    return data;
  };
  const getSegment = (segmentId: string): Promise<segment> => {
    return http.get(`/segments/${segmentId}`);
  };
  const getGroupToProductTypeSettings = (): Promise<Array<
    productTypeGroup
  >> => {
    return http.get(`/segments/settings/product-type-groups`);
  };
  const saveGroupToProductTypeSettings = (
    payload: Array<productTypeGroup>
  ): Promise<void> => {
    return http.put(`/segments/settings/product-type-groups`, payload);
  };
  const shopifyLogin = (token: string): Promise<AuthenticatedClients> => {
    return http.post(
      "/v1/client/shopify/login",
      { token },
      { "X-APP": "dashboard" },
      false
    );
  };
  const getClients = (): Promise<AuthenticatedClients> => {
    return http.get("/v1/client/");
  };
  instance = {
    getClients,
    getOverview,
    getSegments,
    getSegment,
    getGroupToProductTypeSettings,
    saveGroupToProductTypeSettings,
    shopifyLogin
  };
  return instance;
};
