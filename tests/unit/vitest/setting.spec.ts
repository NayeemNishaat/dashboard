import { describe, expect, it } from "vitest";
import {
  factoryBannerSettings,
  factoryProductSettings,
  factoryGeneralSettings
} from "../settings/setup";

describe("General Settings", () => {
  it("shopify users should not see form and see explanation message instead", () => {
    const wrapper = factoryGeneralSettings(
      "SG",
      "en",
      { code: "SGD", format: "${{amount}}", supported_codes: ["SGD"] },
      "shopify"
    );
    console.log(wrapper.html());
    expect(wrapper.html()).toContain("<p>platform : shopify</p>");
    // expect(wrapper.text()).toContain("region");
    // expect(wrapper.text()).toContain("settings:general:regional-settings");
    // expect(wrapper.html()).toContain("settings:general:currency-settings");
  });
  // it("non-shopify users should see form to edit pricing and regional settings", () => {
  //   const wrapper = factoryGeneralSettings(
  //     "SG",
  //     "en",
  //     { code: "SGD", format: "${{amount}}", supported_codes: ["SGD"] },
  //     "woocommerce"
  //   );
  //   expect(wrapper.html()).toContain("<p>platform : woocommerce</p>");
  //   expect(wrapper.html()).toContain("form:storename");
  //   expect(wrapper.html()).toContain("currency code");
  // });
});

// describe("Banner Settings", () => {
//   it("custom banner layout section hidden if banner layout is standard", () => {
//     const wrapper = factoryBannerSettings("standard");
//     expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).not.toContain("large banners");
//   });
//   it("custom banner layout disabled if no access", () => {
//     const wrapper = factoryBannerSettings("basics");
//     expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).toContain(
//       "upgrade your plan to design your own banner layout"
//     );
//   });
//   it("custom banner layout enabled if plan allows it", () => {
//     const wrapper = factoryBannerSettings("premium");
//     expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).not.toContain(
//       "upgrade your plan to design your own banner layout"
//     );
//   });
//   it("block using a layout if plan doesn't have it", () => {
//     const wrapper = factoryBannerSettings("basics", "medium");
//     expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).toContain("upgrade your plan to use this layout");
//   });
//   it("allow using a layout if plan has it", () => {
//     const wrapper = factoryBannerSettings("standard", "medium");
//     expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).toContain("medium rec");
//     expect(wrapper.html()).not.toContain(
//       "upgrade your plan to use this layout"
//     );
//   });
// });

// describe("Product Settings", () => {
//   it("recently viewed should be enabled if allowed in plan", () => {
//     const wrapper = factoryProductSettings("basics");
//     expect(wrapper.html()).toContain(`<elcollapseitem-stub name="recent">`);
//   });
//   it("related categories should be disabled if not allowed in plan", () => {
//     const wrapper = factoryProductSettings("basics");
//     expect(wrapper.html()).toContain(
//       `name="user_related_categories" disabled="true"`
//     );
//   });
// });
/*
describe("Product Settings", () => {
  let router;
  let store;
  let webSettings;
  let newAccess;
  beforeEach(() => {
    webSettings = getNewObject(WebSettings);
    router = new VueRouter();
    newAccess = getNewObject(accessProfiles.basics);

    let settingsGetters = {
      webSettings: () => jest.fn()
    };
    let settingsActions = {
      getSettings: () => jest.fn(),
      saveSettings: () => jest.fn()
    };
    let getters = {
      clientAccess: () => newAccess
    };

    store = new Vuex.Store({
      getters,
      modules: {
        settings: {
          getters: settingsGetters,
          actions: settingsActions
        }
      }
    });
  });
  it("context enabled for products enabled in client plan", () => {
    let stubs = getNewObject(elementStubs);
    stubs.productsPreview = true;
    stubs.Cards = true;
    stubs.LoaderDots = true;
    const wrapper = shallowMount(ProductSettings, {
      store,
      localVue,
      router,
      computed: {
        products: () => webSettings.recommendations.products,
        languageCode: () => "en",
        client: () => {
          return {
            name: "Test Client",
            apikey: "test.myshopify.com",
            profile: { has_finished_onboarding: true },
            email_settings: {},
            algo_settings: null,
            web_settings: webSettings,
            domain: "teststore.com",
            extra: null,
            platform: null,
            type: "shopify",
            active: true,
            email: "test@datacue.co",
            user_name: "Test",
            user_profile: {},
            role: "owner",
            access: accessProfiles.basics
          };
        }
      },
      data() {
        return {
          currentSection: {
            context: webSettings.recommendations.products.context,
            custom_styles: webSettings.recommendations.products.custom_styles
          },
          pageStatus: {
            home: "found",
            product: "found",
            category: "found",
            search: "found",
            "404": "found",
            cart: "found"
          },
          userGuideLinks: {
            en: {
              recent:
                "https://help.datacue.co/guide/products.html#recently-viewed",
              related:
                "https://help.datacue.co/guide/products.html#product-based-recommendations",
              user_related:
                "https://help.datacue.co/guide/products.html#related-products",
              similar:
                "https://help.datacue.co/guide/products.html#similar-to-current-product"
            },
            es: {
              recent:
                "https://help.datacue.co/es/guide/products.html#_4-productos-vistos-recientemente",
              related:
                "https://help.datacue.co/es/guide/products.html#_2-productos-relacionados-al-producto",
              user_related:
                "https://help.datacue.co/es/guide/products.html#_1-productos-relacionados-al-visitante",
              similar:
                "https://help.datacue.co/es/guide/products.html#_3-productos-similares-al-producto"
            }
          },
          titlePlaceholders: {
            en: {
              recent: "Recently viewed",
              related: "Recommended for you",
              similar: "Similar products",
              top: "Top products"
            },
            es: {
              recent: "Productos que viste hace poco",
              related: "Recomendaciones para ti",
              similar: "Productos similares",
              top: "Productos Top"
            }
          },
          productFields: [
            "price",
            "full_price",
            "brand",
            "rating",
            "stock"
          ],
          aspectRatios: [
            [9, 16],
            [2, 3],
            [3, 4],
            [1, 1],
            [4, 3],
            [3, 2],
            [16, 9]
          ],
          default: {
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
                  "404": true,
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
                  "404": true,
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
          },
          lastSaved: webSettings.recommendations.products,
          current: webSettings.recommendations.products
        };
      },
      stubs: stubs
    });
    console.log(wrapper);
  });
});
*/
