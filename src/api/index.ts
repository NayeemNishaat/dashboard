import { getHttpApi } from "./http";
import { summary, segments, segment, datacueApi } from "./interfaces";

export const apiSymbol = Symbol("datacue-api");

export const createApi = (baseURL: string): datacueApi => {
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
    return http.get(`/ads/summary/${segmentId}`);
  };
  return {
    getSummary,
    getSegments,
    getSegment
  };
};
