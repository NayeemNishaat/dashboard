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
  getSummary: (clientId: string) => Promise<summary>;
  getSegments: (clientId: string) => Promise<segments>;
  getSegment: (clientId: string, segmentId: string) => Promise<segment>;
}