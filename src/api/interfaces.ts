import { AuthenticatedClients } from "@/store/datacue_types";

export interface summary {
  stats: { segments: number; max_aov: number; max_size: number };
  opportunities: Array<{ title: string; description: string }>;
}

export interface segments {
  name: string;
  aov: number;
  size: number;
  lifecycle: string;
}

export interface segment {
  pct_customers: number;
  pct_revenue: number;
  rfm: {
    active: number;
    champions: number;
    new_customers: number;
    loyal: number;
  };
  top_products: Array<product>;
  aov: string;
  two_time_buyers: string;
  avg_days_between_purchase: number;
  commonly_bought_together: Array<product>;
}
interface product {
  product_id: string;
  name: string;
  photo_url: string;
}

export interface datacueApi {
  getClients: () => Promise<AuthenticatedClients>;
  getSummary: () => Promise<summary>;
  getSegments: () => Promise<Array<segments>>;
  getSegment: (segmentId: string) => Promise<segment>;
  shopifyLogin: (token: string) => Promise<AuthenticatedClients>;
}
