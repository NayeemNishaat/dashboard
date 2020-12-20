import { shallowMount } from "@vue/test-utils";
import Login from "@/auth/Login.vue";
describe("Login.vue", () => {
  it("non shopify clients - see logging you in", () => {
    jest.mock("vuex", () => ({
      useStore: () => {
        return {
          getters: {
            apikey: "mysite.com"
          }
        };
      }
    }));
    const wrapper = shallowMount(Login);
    expect(wrapper.text()).toContain("Logging you in");
  });
  it("shopify clients - see message to go to their admin panel", () => {
    jest.mock("vuex", () => ({
      useStore: () => {
        return {
          getters: {
            apikey: "something.myshopify.com"
          }
        };
      }
    }));
    const wrapper = shallowMount(Login, {
      stubs: {
        "dc-button": true
      }
    });
    expect(wrapper.text()).toContain("Logging you in");
  });
});
