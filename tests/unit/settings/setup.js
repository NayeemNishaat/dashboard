import { mount, shallowMount } from "@vue/test-utils";
import GeneralSettings from "@/pages/Settings/General.vue";
import BannerSettings from "@/pages/Settings/Banner.vue";
import ProductSettings from "@/pages/Settings/Product.vue";
import { getClient, webSettings, pageInstallation } from "../mocks/store.js";
import countryData from "../mocks/countryData.js";
import { elementStubs, getNewObject } from "../mocks/general";
import { nilDefaultsDeep } from "@/api/utils";
import { defaultProductSettings } from "@/pages/Settings/product";
import { getPageStatus } from "@/store/modules/settings_helpers";
import router from "@/router/index";
import ElementPlus from "element-plus";
import store from "@/store";
import Card from "@/components/Cards/Card.vue";

export const factoryGeneralSettings = (
  country,
  language,
  currency,
  clientType = "shopify"
) => {
  const newWebSettings = getNewObject(webSettings);
  newWebSettings.recommendations.all.language = language;
  newWebSettings.recommendations.all.country = country;
  newWebSettings.recommendations.all.currency = currency;

  return mount(GeneralSettings, {
    global: {
      plugins: [store, router, ElementPlus],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt }
    },
    data() {
      return {
        countrySettings: getNewObject(countryData),
        country,
        language
      };
    },
    computed: {
      client: () => getClient("basics", clientType),
      languageCode: () => "en",
      currency: () => getNewObject(currency),
      webSettings: () => newWebSettings,
      isShopify() {
        return (this.client?.type ?? "shopify") === "shopify";
      }
    }
  });
};

export const factoryBannerSettings = (settings, bannerType) => {
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  let currentSettings = newWebSettings.recommendations.banners;
  if (bannerType) {
    currentSettings.type = bannerType;
  }
  return mount(BannerSettings, {
    global: {
      plugins: [store, router, ElementPlus],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt },
      components: { Card }
    },
    data() {
      return {
        subscription: {
          access: {
            personalization: {
              banners: settings
            }
          }
        },
        current: currentSettings
      };
    }
    // computed: {
    //   client: () => getClient("basics", "shopify"),
    //   subscription: () => newPageInstallation,
    //   webSettings: () => newWebSettings,
    //   languageCode: () => "en",
    //   settings: () => newWebSettings.recommendations.banners,
    //   installationSettings: () =>
    //     newPageInstallation.access.personalization.banners
    // }
  });
};

export const factoryProductSettings = (accessProfile) => {
  return mount(ProductSettings, {
    global: {
      plugins: [store, ElementPlus, router],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt },
      stubs: ["i18n-t", "info-filled", "products-preview", "el-collapse-item"],
      components: { Card }
    },
    props: {
      onboarding: false
    },
    data() {
      return {
        current: {
          pct_promote_discounts: 0,
          section_layout: "grid",
          hide_out_of_stock: true,
          section_size: 8,
          context: {
            recent: {
              active: true,
              title: "",
              enabled: {
                home: true,
                product: true,
                category: true,
                search: true,
                404: true,
                cart: true
              }
            },
            related: {
              active: true,
              title: "",
              enabled: {
                product: true
              }
            },
            user_related: {
              active: true,
              title: "",
              enabled: {
                home: true,
                404: true,
                cart: true
              }
            },
            user_related_categories: {
              active: true,
              title: "",
              enabled: {
                home: true
              },
              sections: 2
            },
            similar: {
              active: true,
              title: "",
              enabled: {
                product: true
              }
            },
            top: {
              active: true,
              title: "",
              enabled: {
                category: true
              }
            }
          },
          cta_button: {
            show_button: false,
            caption: "Add to cart",
            buy_caption: "Buy",
            classes: ""
          },
          show_fields: ["price", "full_price"],
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
          }
        }
      };
    }
  });
};

// bannerAccess: {
//   custom_layout: true,
//   allowed_layouts: ["low", "medium", "high"]
// },
