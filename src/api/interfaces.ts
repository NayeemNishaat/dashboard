import { ClientSubscriptionAccess } from "./billing_interfaces";

export interface Context {
  client: Client;
  user: User;
  subscription: ClientSubscriptionAccess;
  token: string;
}

export interface SetupSummary {
  store_data: {
    has_products_categories: boolean;
    orders: number;
  };
  banners_uploaded: {
    main: number;
    sub: number;
  };
  algo_completed: {
    main_banners: Array<string>;
    sub_banners: Array<string>;
    products: boolean;
  };
}
export interface OnboardingCompletionStatus {
  hasSelectedPlan: boolean;
  recommendationsReady: boolean;
  storeData: {
    productsAndCategories: boolean;
    orders: {
      num: number;
      done: boolean;
      expected: number;
    };
  };
  bannerSectionFound: boolean;
  bannersUploaded: {
    done: boolean;
    main: bannerStatus;
    sub: bannerStatus;
  };
  productSectionFound: boolean;
  productSectionDesigned: boolean;
}

interface bannerStatus {
  count: number;
  expected: number;
}

export interface PageSettings {
  library: boolean;
  products: boolean;
  banners?: boolean;
  static_banner?: {
    link: string;
    photo_url: string;
  };
  integrations?: {
    judgeme: boolean;
    loox: boolean;
  };
}


export interface PageInstallationSettings {
  home: PageSettings;
  product: PageSettings;
  category: PageSettings;
  search: PageSettings;
  "404": PageSettings;
  cart: PageSettings;
}

export interface ClientProfile {
  locale: string;
  has_finished_onboarding: boolean;
  has_finished_setup: boolean;
  shopify_has_storefront: boolean;
}

export interface AlgoSettings {
  active?: boolean;
  last_run_time_in_minutes?: number;
  recommend_out_of_stock?: boolean;
}

export interface Client {
  name: string;
  apikey: string;
  apisecret: string;
  profile: ClientProfile;
  algo_settings: AlgoSettings;
  web_settings: WebSettings;
  domain: string;
  type: string;
  active: boolean;
}

export interface User {
  email: string;
  external_id: string;
  auth_provider: string;
  first_name: string;
  last_name: string;
  profile: userProfile;
}

interface userProfile {
  locale: string;
  collaborator: boolean;
}

export interface PageStatus {
  home: string;
  product: string;
  category: string;
  search: string;
  "404": string;
  cart: string;
}
export interface AuthToken {
  token: string,
  auth_provider: string
}
export interface WebSettings {
  recommendations: {
    all: Locale;
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

export interface Locale {
  language?: string;
  country?: string;
  city?: string;
  currency?: currencyOptions;
}

export interface currencyOptions {
  code: string;
  format: string;
  supported_codes: Array<string>;
}

export interface ClientSettings {
  name: string;
  profile: ClientProfile;
  algo_settings: AlgoSettings;
  web_settings: WebSettings;
}

export interface ClientSettingsUpdate {
  name: string | null;
  profile: ClientProfile | null;
  algo_settings: AlgoSettings | null;
  web_settings: WebSettings | null;
}