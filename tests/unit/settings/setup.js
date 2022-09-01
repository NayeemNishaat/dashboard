import { mount } from "@vue/test-utils";
import VueRouter from "vue-router";
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
export const factoryBannerSettings = (accessProfile, bannerType) => {
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
        current: currentSettings
      };
    },
    computed: {
      client: () => getClient(accessProfile),
      clientAccess: () => getClient(accessProfile).access,
      languageCode: () => "en",
      webSettings: () => newWebSettings,
      banners: () => newWebSettings.recommendations.banners,
      installationSettings: () => newPageInstallation["home"]
    }
  });
};

export const factoryProductSettings = (accessProfile) => {
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  let currentSettings = nilDefaultsDeep(
    {},
    newWebSettings.recommendations.products,
    defaultProductSettings
  );
  return mount(ProductSettings, {
    global: {
      plugins: [store, router, ElementPlus],
      mocks: { $tc: (txt) => txt, $t: (txt) => txt }
    },
    data() {
      return {
        current: currentSettings
      };
    },
    computed: {
      client: () => getClient(accessProfile),
      clientAccess: () => getClient(accessProfile).access,
      apikey: () => "test-store.myshopify.com",
      languageCode: () => "en",
      webSettings: () => newWebSettings,
      pageInstallationSettings: () => newPageInstallation,
      pageStatus: () => getPageStatus("found")
    }
  });
};
