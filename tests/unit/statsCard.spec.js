import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import StatsCard from "/src/components/Cards/StatsCard.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("StatsCard.vue", () => {
  let getters;
  let store;

  beforeEach(() => {
    getters = {
      dateRange: () => ["2020-05-01", "2020-05-03"]
    };
    store = new Vuex.Store({
      getters
    });
  });
  it("renders title when passed", () => {
    const title = "Test";
    const value = "500";
    const comparison = "30";

    const wrapper = mount(StatsCard, {
      propsData: {
        title: title,
        loading: false,
        value: value,
        comparison: comparison
      },
      store,
      localVue
    });
    expect(wrapper.html()).toContain(title);
    expect(wrapper.html()).toContain(value);
    expect(wrapper.html()).toContain(comparison);
  });
});
