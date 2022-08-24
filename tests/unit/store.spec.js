import mutations from "/src/store/mutations";
import { mockAuthenticatedClients, webSettings } from "./mocks/store";

describe("setDateRange", () => {
  it("set a date range", () => {
    const newRange = ["2020-04-07", "2020-04-15"];
    const state = {
      dateRange: ["2020-05-07", "2020-05-15"]
    };

    mutations.setDateRange(state, newRange);
    expect(state).toEqual({
      dateRange: newRange
    });
  });
  it("setAccessToken", () => {
    const payload = "adasdasdasdsa";
    const state = {
      accessToken: null
    };

    mutations.setAccessToken(state, payload);
    expect(state).toEqual({
      accessToken: payload
    });
  });
  it("setLanguageCode", () => {
    const payload = "en";
    const state = {
      languageCode: null
    };

    mutations.setLanguageCode(state, payload);
    expect(state).toEqual({
      languageCode: payload
    });
  });
  it("setNextPage", () => {
    const payload = "billing";
    const state = {
      nextPage: null
    };

    mutations.setNextPage(state, payload);
    expect(state).toEqual({
      nextPage: payload
    });
  });
  it("setApikey", () => {
    const payload = "teststore.datacue.co";
    const state = {
      apikey: null
    };

    mutations.setApikey(state, payload);
    expect(state).toEqual({
      apikey: payload
    });
  });
  it("setAuthenticatedClients", () => {
    const payload = [];
    const state = {
      authenticatedClients: mockAuthenticatedClients
    };

    mutations.setAuthenticatedClients(state, payload);
    expect(state).toEqual({
      authenticatedClients: payload
    });
  });
  it("setUser", () => {
    const payload = {
      name: "Test",
      email: "hello@datacue.co",
      token: "blah-blah-blah"
    };
    const state = {
      user: { name: "soraya", email: "soraya@datacue.co", token: "asdsadas" }
    };

    mutations.setUser(state, payload);
    expect(state).toEqual({
      user: payload
    });
  });
  it("updateClientSettings", () => {
    const payload = {
      web_settings: webSettings,
      email_settings: {},
      profile: { name: "Soraya" }
    };
    const state = {
      authenticatedClients: mockAuthenticatedClients,
      apikey: "test.myshopify.com"
    };

    mutations.updateClientSettings(state, payload);
    expect(
      state.authenticatedClients["test.myshopify.com"].web_settings
    ).toEqual(webSettings);
    expect(
      state.authenticatedClients["test.myshopify.com"].email_settings
    ).toEqual({});
    expect(state.authenticatedClients["test.myshopify.com"].profile).toEqual({
      name: "Soraya"
    });
  });
});
