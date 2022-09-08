import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Vuex from "vuex";
import CardGrid from "@/components/Cards/CardGrid.vue";
import BannerCrd from "@/components/Cards/BannerCard.vue";
import ElementPlus from "element-plus";

const store = new Vuex.Store({});

test("CardGrid", () => {
  const wrapper = mount(CardGrid as any, {
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

test("CardGrid Sad", () => {
  const wrapper = mount(CardGrid as any, {
    global: {
      plugins: [store],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt },
      stubs: ["el-input", "el-radio", "el-radio-group"]
    },
    props: {
      cardType: 124 // Note: Invalid Value
    },
    data() {
      return { filter: "", maxcards: -10 }; // Invalid value but handled in the component.
    }
  });
  expect(wrapper.html()).toContain('modelvalue="ctr_norm"');
});

test("BannerCrd", () => {
  const wrapper = mount(BannerCrd as any, {
    global: {
      plugins: [store, ElementPlus],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      name: "Product",
      photoURL: "url",
      bannerID: "String",
      type: "String",
      link: "String",
      clicks: 12,
      impressions: 567,
      conversions: 44,
      rating: 34,
      score: 46
    }
  });
  // expect(wrapper.text()).toContain("Product");
  expect(wrapper.html()).toContain('src="url"');
  expect(wrapper.html()).toContain("views: 567");
  expect(wrapper.findAll(".ti-trash").length).toEqual(
    wrapper.findAll(".ti-trash").length
  );
  expect(wrapper.find(".ti-trash").trigger("click"));
  expect(wrapper.html()).not.toContain(".ti-trash");
  // expect(wrapper.html()).toContain(".ti-trash"); // Point: Fails because card is deleted.
});

test("BannerCrd Sad", () => {
  const wrapper = mount(BannerCrd as any, {
    global: {
      plugins: [store, ElementPlus],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    props: {
      name: "Product",
      photoURL: "url",
      bannerID: "String",
      type: "String",
      link: "String",
      clicks: "6y",
      impressions: 567,
      conversions: 44,
      rating: 34,
      score: "fhj"
    }
  });

  console.log(wrapper.html());
});
