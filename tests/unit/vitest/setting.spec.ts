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
      "es",
      { code: "SGD", format: "${{amount}}", supported_codes: ["SGD"] },
      "shopify"
    );
    expect(wrapper.html()).toContain("<p>platform : shopify</p>");
    expect(wrapper.html()).toContain("settings:general:currency-settings");
    expect(wrapper.html()).toContain("settings:general:currency-settings");
  });
  it("non-shopify users should see form to edit pricing and regional settings", () => {
    const wrapper = factoryGeneralSettings(
      "SG",
      "en",
      { code: "SGD", format: "${{amount}}", supported_codes: ["SGD"] },
      "woocommerce"
    );
    expect(wrapper.html()).toContain("<p>platform : woocommerce</p>");
    expect(wrapper.html()).toContain("form:storename");
    expect(wrapper.html()).toContain("currency code");
  });
});

// describe("Banner Settings", () => {
//   it("custom banner layout section hidden if banner layout is standard", () => {
//     const wrapper = factoryBannerSettings("standard");
//     console.log(wrapper.html());
//     // expect(wrapper.html()).toContain("select banner layout");
//     expect(wrapper.html()).not.toContain("large banners");
//   });
//   // it("custom banner layout disabled if no access", () => {
//   //   const wrapper = factoryBannerSettings("basics");
//   //   expect(wrapper.html()).toContain("select banner layout");
//   //   expect(wrapper.html()).toContain(
//   //     "upgrade your plan to design your own banner layout"
//   //   );
//   // });
//   // it("custom banner layout enabled if plan allows it", () => {
//   //   const wrapper = factoryBannerSettings("premium");
//   //   expect(wrapper.html()).toContain("select banner layout");
//   //   expect(wrapper.html()).not.toContain(
//   //     "upgrade your plan to design your own banner layout"
//   //   );
//   // });
//   // it("block using a layout if plan doesn't have it", () => {
//   //   const wrapper = factoryBannerSettings("basics", "medium");
//   //   expect(wrapper.html()).toContain("select banner layout");
//   //   expect(wrapper.html()).toContain("upgrade your plan to use this layout");
//   // });
//   // it("allow using a layout if plan has it", () => {
//   //   const wrapper = factoryBannerSettings("standard", "medium");
//   //   expect(wrapper.html()).toContain("select banner layout");
//   //   expect(wrapper.html()).toContain("medium rec");
//   //   expect(wrapper.html()).not.toContain(
//   //     "upgrade your plan to use this layout"
//   //   );
//   // });
// });

describe("Product Settings", () => {
  it("recently viewed should be enabled if allowed in plan", () => {
    const wrapper = factoryProductSettings("basics");
    expect(wrapper.html()).toContain(`<el-collapse-item-stub name="recent"`);
  });
  it("related categories should be disabled if not allowed in plan", () => {
    const wrapper = factoryProductSettings("basics");
    expect(wrapper.html()).toContain(
      `name="user_related_categories" disabled="true"`
    );
  });
});
