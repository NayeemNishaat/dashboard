export interface AuthenticatedClients {
  clients: Clients;
  user: User;
  shopify_token?: string;
}

export interface Clients {
  [key: string]: Client;
}
export interface Client {
  name: string;
  apikey: string;
  apisecret: string;
  profile: { [key: string]: profile };
  web_settings: WebSettings;
  domain: string;
  platform: string;
  type: string;
  active: boolean;
  email: string;
  user_name: string;
  role: string;
  access: PlanFeatures;
  plan_name: string;
}

export interface profile {
  has_finished_onboarding: boolean;
}

export interface User {
  name: string;
  email: string;
  token: string;
  is_partner: boolean;
  is_owner: boolean;
}

export interface PlanFeatures {
  ads?: {
    segments: number;
  };
  personalization?: {
    banners?: {
      banner_limit: number;
      custom_layout: boolean;
      allowed_layouts: Array<string>;
    };
    products?: {
      recent: boolean;
      related: boolean;
      user_related: boolean;
      user_related_categories: boolean;
      similar: boolean;
      top: boolean;
    };
    ab_testing?: boolean;
    notifications?: boolean;
  };
}

export interface WebSettings {
  recommendations: {
    all: allConfig;
    first_time: {
      default: string;
      segment_name: string;
    };
    notifications: NotificationsConfig;
    banners: {
      main_banners?: number;
      sub_banners?: number;
      type?: string;
    };
    products: {
      context: {
        recent: SingleSectionConfig;
        related: SingleSectionConfig;
        user_related: SingleSectionConfig;
        user_related_categories: MultiSectionConfig;
        similar: SingleSectionConfig;
        top: SingleSectionConfig;
      };
      section_size: number;
      section_layout: string;
      show_fields: Array<string>;
      css: { [key: string]: any };
      custom_styles: { [key: string]: any };
      pct_promote_discounts: number;
      hide_out_of_stock: boolean;
    };
  };
  testing: {
    profile: number;
    user_ids: Array<string>;
  };
}

interface SingleSectionConfig {
  active?: boolean;
  title: string;
  limit?: number;
  enabled?: {
    [key: string]: boolean;
  };
}

interface MultiSectionConfig extends SingleSectionConfig {
  sections?: number;
}

interface NotificationsConfig {
  color: string;
  position: string;
  limit: number;
}

export interface allConfig {
  language?: string;
  country?: string;
  currency?: currencyOptions;
}

export interface currencyOptions {
  code: string;
  format: string;
  supported_codes: Array<string>;
}
