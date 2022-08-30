import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Vuex from "vuex";
import StatsCard from "@/components/Cards/CardGrid.vue";

const store = new Vuex.Store({});

test("ViewBanners", () => {
  const wrapper = mount(StatsCard as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt },
      stubs: ["el-input", "el-radio", "el-radio-group"]
    },
    props: {
      loading: false
    },
    data() {
      return { filter: "rtyui", sortField: "clicks" };
    }
  });
  expect(wrapper.text()).toContain("no data for this period");
});
