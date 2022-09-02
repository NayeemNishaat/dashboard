import { mount } from "@vue/test-utils";
import GeneralSettings from "@/pages/Settings/General.vue";
import BannerSettings from "@/pages/Settings/Banner.vue";
import ProductSettings from "@/pages/Settings/Product.vue";
import { getClient, webSettings, pageInstallation } from "../mocks/store.js";
import { nilDefaultsDeep } from "../../../src/api/utils";
import countryData from "../mocks/countryData.js";
import { getNewObject } from "../mocks/general";
import router from "@/router/index";
import ElementPlus from "element-plus";
import store from "@/store";
import Card from "@/components/Cards/Card.vue";
import { defaultProductSettings } from "../../../src/pages/Settings/product";

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
  });
};

export const factoryProductSettings = (settings) => {
  return mount(ProductSettings, {
    global: {
      plugins: [store, ElementPlus, router],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt },
      stubs: ["i18n-t", "info-filled", "products-preview", "el-collapse-item"],
      components: { Card }
    },
    data() {
      return {
        current: {
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
          }
        }
      };
    },
    computed: {
      productAccess() {
        if (!this.apikey) {
          return {};
        }
        return this.subscription?.access?.personalization?.products;
      }
    }
  });
};

/* export const factoryProductSettings = (accessProfile) => {
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  const client = getClient("basics", "shopify");
  let currentSettings = nilDefaultsDeep(
    {},
    newWebSettings.recommendations.products,
    defaultProductSettings
  );
  return mount(ProductSettings, {
    global: {
      plugins: [store, router, ElementPlus],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt },
      // stubs: ["products-preview"],
      components: { Card }
    },
    data() {
      return {
        props: {
          onboarding: false
        },
        data() {
          return {
            subscription: {
              access: {
                personalization: {
                  products: {
                    recent: true,
                    user_related: true,
                    related: true,
                    top: true,
                    user_related_categories: true,
                    similar: true
                  }
                }
              }
            },
            current: {
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
              }
            }
          };
        }
      };
    }
    // computed: {
    //   client: () => getClient(accessProfile),
    //   clientAccess: () => getClient(accessProfile).access,
    //   apikey: () => "test-store.myshopify.com",
    //   languageCode: () => "en",
    //   webSettings: () => newWebSettings,
    //   pageInstallationSettings: () => newPageInstallation,
    //   pageStatus: () => getPageStatus("found")
    // }
  });
};
 */
