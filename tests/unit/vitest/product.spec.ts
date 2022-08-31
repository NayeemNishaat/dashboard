import { mount } from "@vue/test-utils";
import { test, expect, beforeEach } from "vitest";
import Vuex from "vuex";
import ViewProducts from "@/pages/Products/ViewProducts.vue";
import ElementPlus from "element-plus";

test("ViewProducts", () => {
  beforeEach(() => {
    const getters = {
      dateRange: () => ["2020-05-01", "2020-05-03"]
    };
    const store = new Vuex.Store({
      getters
    });
    const wrapper = mount(ViewProducts as any, {
      global: {
        plugins: [store, ElementPlus],
        mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
      },
      data() {
        return {
          productFilter: "recent",
          allSections: [
            "recent",
            "related",
            "user_related",
            "user_related_categories",
            "top",
            "similar"
          ],
          productPerf: [],
          loading: true,
          error: false
        };
      }
    });
    // expect(wrapper.text()).toContain("no data for this period");
  });
});
