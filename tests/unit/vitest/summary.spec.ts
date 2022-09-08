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
      loading: false
    }
  });

  expect(wrapper.text()).toContain("This is a test");
  expect(wrapper.html()).toContain("22");
  expect(wrapper.text()).not.toContain("test comparison");
  expect(wrapper.html()).not.toContain('class="loader dots"');
});

test("StatsCard Sad", () => {
  const wrapper = mount(StatsCard as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      loading: "dgdgh" // Note: Invalid but handled by the component
    }
  });

  expect(wrapper.html()).toContain('class="loader dots"');
});

test("StatsCard Sad", () => {
  const wrapper = mount(StatsCard as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      value: "sfdg",
      comparison: "test comparison",
      loading: false // Note: Invalid but handled by the component
    }
  });

  expect(wrapper.html()).toContain(0);
  expect(wrapper.text()).not.toContain("test comparison");
});
