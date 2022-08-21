import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import GeneralSettings from "@/pages/Settings/General.vue";
import BannerSettings from "@/pages/Settings/Banner.vue";
import ProductSettings from "@/pages/Settings/Product.vue";
import { getClient, webSettings, pageInstallation } from "../mocks/store.js";
import countryData from "../mocks/countryData.js";
import { elementStubs, getNewObject } from "../mocks/general";
import { nilDefaultsDeep } from "../../../src/api/utils";
import { defaultProductSettings } from "../../../src/pages/Settings/product";
import { getPageStatus } from "../../../src/store/modules/settings_helpers";

const localVue = createLocalVue();
localVue.use(VueRouter);

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

  const router = new VueRouter();
  return shallowMount(GeneralSettings, {
    localVue,
    router,
    stubs: elementStubs,
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
      webSettings: () => newWebSettings
    }
  });
};
export const factoryBannerSettings = (accessProfile, bannerType) => {
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  const router = new VueRouter();
  let currentSettings = newWebSettings.recommendations.banners;
  if (bannerType) {
    currentSettings.type = bannerType;
  }
  return shallowMount(BannerSettings, {
    localVue,
    router,
    stubs: elementStubs,
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

export const factoryProductSettings = accessProfile => {
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  const router = new VueRouter();
  let currentSettings = nilDefaultsDeep(
    {},
    newWebSettings.recommendations.products,
    defaultProductSettings
  );
  return shallowMount(ProductSettings, {
    localVue,
    router,
    stubs: elementStubs,
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
