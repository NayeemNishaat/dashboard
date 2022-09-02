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
            ...settings
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
