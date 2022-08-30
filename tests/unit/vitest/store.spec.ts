import { it, expect } from "vitest";
import mutations from "./mocks/mutation";
import State from "./mocks/state";
import { Context } from "@/api/interfaces";

it("Tests the state (Happy)", () => {
  const dateRange = ["2020-07-15", "2020-08-03"] as unknown as [Date, Date];
  const accessToken = { token: "gdg", auth_provider: "fdg" };
  const languageCode = "en";
  const nextPage = "en";
  const context = null;
  const state = new State(
    accessToken,
    dateRange,
    languageCode,
    nextPage,
    context
  );

  mutations.setDateRange(state, dateRange);

  expect(dateRange).toEqual(state.dateRange);
  expect(accessToken).toEqual(state.accessToken);
  expect(languageCode).toEqual(state.languageCode);
  expect(nextPage).toEqual(state.nextPage);
  expect(context).toEqual(state.context);
});

it("Tests the state (Sad)", () => {
  const dateRange = [new Date(), "afsg"] as unknown as [Date, Date];
  const accessToken = { token: "gdg", auth_provider: "fdg" };
  const languageCode = "es";
  // const languageCode = "bn"; // Remark: This throws en error
  const nextPage = "sfdh";
  const context = null;
  const state = new State(
    accessToken,
    dateRange,
    languageCode,
    nextPage,
    context
  );

  mutations.setDateRange(state, dateRange);

  expect(dateRange).toEqual(state.dateRange);
  expect(accessToken).toEqual(state.accessToken);
  expect(languageCode).toEqual(state.languageCode);
  expect(nextPage).toEqual(state.nextPage);
  expect(context).toEqual(state.context);
});

it("Tests the state (Sad)", () => {
  const dateRange = [234, "afsg"] as unknown as [Date, Date];
  const accessToken = { token: "gdg", auth_provider: "1234" };
  const languageCode = "es";
  const nextPage = "dsfv";

  const context = {} as Context;
  const state = new State(
    accessToken,
    dateRange,
    languageCode,
    nextPage,
    context
  );

  mutations.setDateRange(state, dateRange);

  expect(dateRange).toEqual(state.dateRange);
  expect(accessToken).toEqual(state.accessToken);
  expect(languageCode).toEqual(state.languageCode);
  expect(nextPage).toEqual(state.nextPage);
  expect(context).toEqual(state.context);
});
