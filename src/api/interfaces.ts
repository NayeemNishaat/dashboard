import { AuthenticatedClients } from "@/store/datacue_types";

export interface overview {
  stats: { dc_revenue: number; ad_spend: number; roi: number };
  opportunities: Array<{ title: string; description: string }>;
}

export interface segmentRecommendations {
  summary: Array<{ r: number; x: number; y: number; label: string }>;
  acquisition: Array<{
    customers: number;
    cluster_id: string;
    rev_per_customer: number;
  }>;
  retention: Array<{
    label: string;
    customers: number;
    rev_per_customer: number;
  }>;
}

export interface productTypeGroup {
  group_id: string;
  product_types: Array<string>;
}

export interface segment {
  stats: { revenue: number; customers: number; aov: number };
  pct_customers: number;
  pct_revenue: number;
  rfm: Array<{
    rfm_level: string;
    customers: number;
  }>;
  product_groups: {
    [key: string]: number;
  };
  top_products: Array<product>;
  commonly_bought_together: Array<product>;
}
interface product {
  product_id: string;
  name: string;
  photo_url: string;
}

export interface datacueApi {
  getClients: () => Promise<AuthenticatedClients>;
  getOverview: () => Promise<overview>;
  getSegments: () => Promise<segmentRecommendations>;
  getSegment: (segmentId: string) => Promise<segment>;
  getGroupToProductTypeSettings: () => Promise<Array<productTypeGroup>>;
  saveGroupToProductTypeSettings: (
    payload: Array<productTypeGroup>
  ) => Promise<void>;
  shopifyLogin: (token: string) => Promise<AuthenticatedClients>;
}
