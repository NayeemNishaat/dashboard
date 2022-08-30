import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Vuex from "vuex";
import StatsCard from "@/components/Cards/StatsCard.vue";

const getters = {
  dateRange: () => ["2020-05-01", "2020-05-03"]
};
const store = new Vuex.Store({
  getters
});

test("StatsCard", () => {
  const wrapper = mount(StatsCard as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      title: "This is a test",
      value: "22",
      comparison: "test comparison",
      loading: true
    }
  });

  expect(wrapper.text()).toContain("This is a test");
  expect(wrapper.html()).not.toContain("22");
  expect(wrapper.text()).not.toContain("test comparison");
  expect(wrapper.html()).toContain('class="loader dots"');
});

test("StatsCard", () => {
  const wrapper = mount(StatsCard as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      title: "Test2",
      value: "300",
      comparison: "test comparison",
      loading: false
    }
  });

  expect(wrapper.text()).toContain("Test2");
  expect(wrapper.html()).toContain(300);
  expect(wrapper.text()).toContain("test comparison");
  expect(wrapper.html()).not.toContain('class="loader dots"');
});
