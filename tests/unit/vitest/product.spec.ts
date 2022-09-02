import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Vuex from "vuex";
// import ViewProducts from "@/pages/Products/ViewProducts.vue";
import CardGrid from "@/components/Cards/CardGrid.vue";
// import store from "@/store";
// import BannerCard from "@/components/Cards/BannerCard.vue";
import ElementPlus from "element-plus";

test("CardGrid", () => {
  const store = new Vuex.Store({});

  const wrapper = mount(CardGrid as any, {
    global: {
      plugins: [store, ElementPlus],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
      // components: { BannerCard }
    },
    props: {
      loading: false,
      cards: [
        {
          ctr: 0.03529411764705882,
          name: "Beach Towel",
          clicks: 9,
          ctr_norm: 5,
          photo_url: "https://demo.datacue.co/products/1.jpg",
          product_id: "1",
          impressions: 255
        },
        {
          ctr: 0.3816793893129771,
          name: "Modern white table",
          clicks: 50,
          ctr_norm: 5,
          photo_url: "https://demo.datacue.co/products/100.jpg",
          product_id: "100",
          impressions: 131
        },
        {
          ctr: 0.06962025316455696,
          name: "Gold table lamp",
          clicks: 33,
          ctr_norm: 3,
          photo_url: "https://demo.datacue.co/products/102.jpg",
          product_id: "102",
          impressions: 474
        },
        {
          ctr: 0,
          name: "New table lamp with light",
          clicks: 0,
          ctr_norm: 2,
          photo_url: "https://demo.datacue.co/products/101.jpg",
          product_id: "101",
          impressions: 53
        },
        {
          ctr: 0.09932279909706546,
          name: "Red fabric sofa",
          clicks: 44,
          ctr_norm: 2,
          photo_url: "https://demo.datacue.co/products/105.jpg",
          product_id: "105",
          impressions: 443
        }
      ],
      cardType: "products"
    },
    data() {
      return {
        maxcards: 18,
        filter: "beach"
      };
    }
  });
  // expect(wrapper.text()).toContain("Modern W66hite Table"); // Note: Should Fail
  expect(wrapper.text()).not.toContain("Modern White Table");
  // expect(wrapper.text()).not.toContain("Beach Towel"); // Note: Should Fail
  expect(wrapper.text()).toContain("Beach Towel");
});
