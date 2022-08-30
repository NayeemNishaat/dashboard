import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import SetupSummary from "@/pages/SetupSummary.vue";
import { elementStubs, getNewObject } from "./mocks/general";
import { getClient, webSettings, pageInstallation } from "./mocks/store.js";
import { RouterLinkStub } from "@vue/test-utils";

const summaryData = {
  hasSelectedPlan: false,
  recommendationsReady: false,
  bannerSectionFound: false,
  storeData: {
    productsAndCategories: false,
    orders: {
      num: 0,
      done: false
    }
  },
  bannersUploaded: {
    done: false,
    main: 0,
    sub: 0
  },
  productSectionFound: false,
  productSectionDesigned: false
};

const localVue = createLocalVue();
export const setupSummary = (storeData, accessProfile, type = "shopify") => {
  const router = new VueRouter();
  const newWebSettings = getNewObject(webSettings);
  const newPageInstallation = getNewObject(pageInstallation);
  return mount(SetupSummary, {
    localVue,
    router,
    stubs: {
      RouterLink: RouterLinkStub,
      ...elementStubs
    },
    data() {
      return {
        loading: false
      };
    },
    computed: {
      setupSummary: () => storeData,
      pageStatus: () => JSON.parse("{}"),
      installationSettings: () => newPageInstallation["home"],
      webSettings: () => newWebSettings,
      client: () => getClient(accessProfile, type),
      languageCode: () => "en",
      trustedClient: () => type === "shopify",
      hasFinishedSetup: () => false
    }
  });
};

localVue.use(Vuex);

describe("Setup Summary - Account setup", () => {
  it("no plan selected", () => {
    const wrapper = setupSummary({ ...summaryData }, "");
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:false");
    expect(wrapper.html()).toContain("setupSummary:NoPlanSelected:title");
  });
  it("trusted client, plan selected, recommendations not ready and no products / categories", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        hasSelectedPlan: true
      },
      "essentials"
    );
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:false");
    expect(wrapper.html()).toContain(
      "setupSummary:RecsNotReady:SyncingStoreData:title"
    );
  });
  it("trusted client, plan selected, recommendations not ready and has products / categories", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        hasSelectedPlan: true,
        storeData: {
          productsAndCategories: true,
          orders: {
            num: 0,
            done: false
          }
        }
      },
      "essentials"
    );
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:false");
    expect(wrapper.html()).toContain("setupSummary:RecsNotReady:title");
  });
  it("plugin client, plan selected, recommendations not ready and no products / categories", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        hasSelectedPlan: true,
        storeData: {
          productsAndCategories: false,
          orders: {
            num: 0,
            done: false
          }
        }
      },
      "essentials",
      "woocommerce"
    );
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:false");
    expect(wrapper.html()).toContain(
      "setupSummary:RecsNotReady:InstallPlugin:title"
    );
  });

  it("plan selected, recommendations ready, not enough orders", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        hasSelectedPlan: true,
        recommendationsReady: true,
        storeData: {
          productsAndCategories: true,
          orders: {
            num: 0,
            done: false
          }
        }
      },
      "essentials"
    );
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:true");
    expect(wrapper.html()).toContain(
      "setupSummary:RecsReady:InsufficentOrders:title"
    );
  });
  it("plan selected, recommendations ready, enough orders", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        hasSelectedPlan: true,
        recommendationsReady: true,
        storeData: {
          productsAndCategories: true,
          orders: {
            num: 100,
            done: true
          }
        }
      },
      "essentials"
    );
    expect(wrapper.html()).toContain("setupSummary:ActivateDataCue:true");
    expect(wrapper.html()).toContain("setupSummary:RecsReady:title");
  });
});

describe("Setup Summary - Banners", () => {
  it("banner section not installed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        bannerSectionFound: false
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:banners:section:false:title"
    );
  });
  it("banner section installed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        bannerSectionFound: true
      },
      ""
    );
    expect(wrapper.html()).toContain("setupSummary:banners:section:true:title");
  });
  it("not enough banner uploads", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        ...{ bannersUploaded: { done: false, main: 1, sub: 1 } }
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:banners:uploads:false:title"
    );
  });
  it("enough banner uploads", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        ...{ bannersUploaded: { done: true, main: 10, sub: 10 } }
      },
      ""
    );
    expect(wrapper.html()).toContain("setupSummary:banners:uploads:true:title");
  });
});

describe("Setup Summary - Products", () => {
  it("products section not installed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        productSectionFound: false
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:products:section:false:title"
    );
  });
  it("product section installed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        productSectionFound: true
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:products:section:true:title"
    );
  });
  it("product widget not designed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        productSectionDesigned: false
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:products:designed:false:title"
    );
  });
  it("product widget designed", () => {
    const wrapper = setupSummary(
      {
        ...summaryData,
        productSectionDesigned: true
      },
      ""
    );
    expect(wrapper.html()).toContain(
      "setupSummary:products:designed:true:title"
    );
  });
});
