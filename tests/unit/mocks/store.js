import {
  defaultHomepageSettings,
  defaultPageSettings
} from "@/store/modules/settings_helpers";
import accessProfiles from "./accessProfiles.js";

export const pageInstallation = {
  home: defaultHomepageSettings,
  product: defaultPageSettings,
  category: defaultPageSettings,
  404: defaultPageSettings,
  cart: defaultPageSettings,
  search: defaultPageSettings
};

export const webSettings = {
  testing: {
    profile: 4,
    user_ids: null
  },
  recommendations: {
    all: {
      country: "US",
      pricing: {
        currency: {
          symbol: "$",
          placement: "front"
        },
        separator: {
          group: ".",
          decimal: ",",
          currency: ""
        },
        show_cents: 2
      },
      language: "es"
    },
    first_time: {
      default: "",
      segment_name: "default"
    },
    notifications: {
      color: "#000000",
      limit: 0,
      position: "top right"
    },
    banners: {
      main_banners: 2,
      sub_banners: 2,
      type: "high"
    },
    products: {
      context: {
        recent: {
          active: true,
          title: "Recently Viewed",
          enabled: {
            home: true,
            product: true,
            category: true,
            search: true,
            cart: true,
            404: true
          }
        },
        related: {
          active: true,
          title: "Related products",
          enabled: {
            product: true
          }
        },
        user_related: {
          active: true,
          title: "Related products",
          enabled: {
            home: true,
            category: true,
            search: true,
            cart: true,
            404: true
          }
        },
        user_related_categories: {
          active: true,
          sections: 3,
          enabled: {
            home: true,
            search: true,
            cart: true,
            404: true
          }
        },
        similar: {
          active: true,
          title: "Similar products",
          enabled: {
            product: true
          }
        },
        top: {
          active: true,
          title: "Top products",
          enabled: {
            category: true
          }
        }
      },
      section_size: 10,
      section_layout: "grid",
      show_fields: ["price", "carousel_bottom"],
      "css-selectors": {
        404: ".better-404-pages-container-fluid",
        index: ".cuadros",
        search: ".no-search",
        product: ".datacue-car"
      },
      custom_styles: {
        header: {
          active: false,
          color: null,
          "text-align": "left",
          "font-size": 24,
          "font-weight": 600,
          "text-transform": "none",
          decorations: {
            active: false,
            "border-bottom-width": 1,
            "border-color": null
          }
        },
        photo: {
          active: false,
          "border-width": 1,
          "border-color": "#cccccc",
          padding: 10,
          proportions: {
            active: false,
            "aspect-ratio": "1/1"
          }
        },
        tag: {
          active: false,
          style: "classic",
          color: null,
          "background-color": null
        },
        title: {
          active: false,
          color: null,
          "font-size": 16,
          "font-weight": 400,
          "text-align": "left",
          "text-transform": "none"
        },
        price: {
          active: false,
          "text-align": "left",
          current: {
            color: null,
            "font-size": 16,
            "font-weight": 400
          },
          full: {
            color: null,
            "font-size": 16,
            "font-weight": 400
          },
          discount: {
            color: null,
            "font-size": 16,
            "font-weight": 400
          }
        },
        layout: {
          active: false,
          show_next_item: true,
          items_per_page: {
            mobile: 2,
            desktop: 4
          },
          advanced: {
            active: false,
            spacing: 2,
            "max-width": 1200
          }
        }
      },
      pct_promote_discounts: 0,
      hide_out_of_stock: true
    }
  }
};

export const customStylesDesigned = {
  tag: {
    color: null,
    style: "classic",
    active: true,
    "background-color": null
  },
  photo: {
    active: true,
    padding: 10,
    proportions: { active: false, "aspect-ratio": "1/1" },
    "border-color": "#cccccc",
    "border-width": 0
  },
  price: {
    full: { color: null, "font-size": 16, "font-weight": 400 },
    active: false,
    current: { color: null, "font-size": 16, "font-weight": 400 },
    discount: { color: null, "font-size": 16, "font-weight": 400 },
    "text-align": "left"
  },
  title: {
    color: null,
    active: true,
    "font-size": 16,
    "text-align": "left",
    "font-weight": 400,
    "text-transform": "none"
  },
  header: {
    color: null,
    active: true,
    "font-size": 24,
    "text-align": "center",
    decorations: {
      active: false,
      "border-color": null,
      "border-bottom-width": 1
    },
    "font-weight": 600,
    "text-transform": "none"
  },
  layout: {
    active: true,
    advanced: { active: false, spacing: 2, "max-width": 1200 },
    items_per_page: { mobile: 2, desktop: 4 },
    show_next_item: true
  }
};

export function getClient(accessProfile, type = "shopify") {
  let client = {
    name: "test store",
    apikey: "teststore.myshopify.com",
    apisecret: "",
    profile: {},
    email_settings: {},
    algo_settings: null,
    web_settings: webSettings,
    domain: "shopify-demo-store.datacue.co",
    extra: null,
    platform: null,
    type,
    active: false,
    email: "soraya@datacue.co",
    user_name: "Soraya",
    user_profile: {
      emails: ["weekly_report", "news"],
      help_widget_position: "93.10344827586206,89.04694167852062"
    },
    role: "member"
  };
  if (accessProfiles[accessProfile]) {
    client = {
      ...client,
      access: accessProfiles[accessProfile],
      plan_name: accessProfile
    };
  }
  return client;
}

export const mockAuthenticatedClients = {
  "test.myshopify.com": {
    name: "My Cool Store",
    apikey: "test.myshopify.com",
    apisecret: "",
    profile: { has_finished_onboarding: true, name: "Soraya" },
    email_settings: {
      mailing_address: "testuser@datacue.co",
      mailing_address_status: "unverified",
      mailing_address_verified: false
    },
    algo_settings: null,
    web_settings: {
      recommendations: {
        all: {
          country: "US",
          language: "es",
          pricing: {
            currency: { placement: "front", symbol: "$" },
            separator: { currency: " ", decimal: ".", group: "," },
            show_cents: 2
          }
        },
        banners: { main_banners: 2, sub_banners: 2, type: "medium" },
        first_time: { default: "", segment_name: "default" },
        notifications: { color: "#000000", limit: 10, position: "top right" },
        products: {
          "css-selectors": { 404: "", product: "" },
          limits: {
            product: { related: 10, similar: 0, slider: null },
            user: { recent: 10, related: 10, slider: null }
          },
          pct_promote_discounts: null,
          show_fields: null,
          titles: null
        }
      },
      testing: { profile: 4, user_ids: null }
    },
    domain: "demo.datacue.co",
    extra: null,
    platform: null,
    type: "shopify",
    active: false,
    email: "shahram@datacue.co",
    user_name: "Shahram",
    user_profile: {
      Banners: { link_format: "" },
      emails: ["weekly_report", "news"],
      help_widget_position: "93.79968203497614,83.77622377622377"
    },
    role: "owner",
    access: {
      banners: {
        banner_limit: 100,
        custom_layout: true,
        allowed_layouts: ["low", "medium", "high"]
      },
      products: {
        recent: true,
        related: true,
        user_related: true,
        user_related_categories: true,
        similar: true,
        top: true
      },
      ab_testing: false,
      notifications: true
    }
  },
  "4EEJzQ6UQcIwXz93Noqm": {
    name: "Depto51",
    apikey: "4EEJzQ6UQcIwXz93Noqm",
    apisecret: "",
    profile: {
      Banners: { link_format: "" },
      emails: ["weekly_report"],
      help_widget_position: "93.3806146572104,79.14110429447852",
      name: "Shahram"
    },
    email_settings: {
      mailing_address: "shahram.anver+newemailz@gmail.com",
      mailing_address_status: "unverified",
      mailing_address_verified: false,
      subscriber_sync: {
        mailchimp: {
          apikey: "cb02fb1f5e2b8548c6f72cac7db2a523-us16",
          status: "completed"
        }
      }
    },
    algo_settings: null,
    web_settings: {
      recommendations: {
        all: {
          country: "AE",
          language: "ar",
          pricing: {
            currency: { placement: "front", symbol: "د.إ" },
            separator: { currency: " ", decimal: ",", group: "." },
            show_cents: 2
          }
        },
        banners: { main_banners: 1, sub_banners: 2, type: "medium" },
        first_time: { default: "", segment_name: "default" },
        notifications: { color: "#000000", limit: 10, position: "top right" },
        products: {
          "css-selectors": {},
          limits: {
            product: { related: 4, similar: 4, slider: false },
            user: { recent: 8, related: 8, slider: false }
          },
          pct_promote_discounts: 0,
          titles: {
            recent: "Productos que viste hace poco",
            related: "Recomendaciones para ti",
            similar: "Productos similares"
          }
        }
      },
      testing: { profile: 4, user_ids: ["879092465728", "1974239232048"] }
    },
    domain: "www.depto51.com",
    extra: null,
    platform: null,
    type: "shopify",
    active: false,
    email: "shahram@datacue.co",
    user_name: "Shahram",
    user_profile: {
      Banners: { link_format: "" },
      emails: ["weekly_report", "news"],
      help_widget_position: "93.79968203497614,83.77622377622377"
    },
    role: "owner",
    access: {
      banners: { banner_limit: 0, custom_layout: false, allowed_layouts: null },
      products: {
        recent: false,
        related: false,
        user_related: false,
        user_related_categories: false,
        similar: false,
        top: false
      },
      ab_testing: false,
      notifications: false
    }
  }
};
