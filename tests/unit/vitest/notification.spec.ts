import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Vuex from "vuex";
import ViewNotifications from "@/pages/Notifications/ViewNotifications.vue";
import ElementPlus from "element-plus";

const store = new Vuex.Store({});

test("ViewNotifications", () => {
  const wrapper = mount(ViewNotifications as any, {
    global: {
      plugins: [store, ElementPlus],
      mocks: { $tc: (txt: string) => txt, $t: (txt: string) => txt }
    },
    data() {
      return {
        notificationsPerf: [],
        notificationsFilter: "on discount",
        statsCards: [
          {
            type: "info",
            icon: "ti-bell",
            title: "notifications",
            value: "100",
            comparison: "n/a",
            footer: "notifications generated"
          },
          {
            type: "info",
            icon: "ti-user",
            title: "users",
            value: "0",
            comparison: "n/a",
            footer: "users with notifications"
          },
          {
            type: "info",
            icon: "ti-package",
            title: "products",
            value: "0",
            comparison: "n/a",
            footer: "products with notifications"
          }
        ],
        loading: true,
        error: false
      };
    }
  });
  // expect(wrapper.text()).toContain("100");
});
