import { it, expect } from "vitest";
import mutations from "../mocks/mutation";
import State from "../mocks/state";
import { Context } from "@/api/interfaces";

it("Tests the state (Happy)", () => {
  const dateRange = ["2020-07-15", "2020-08-03"] as unknown as [Date, Date];
  const accessToken = { token: "gdg", auth_provider: "fdg" };
  const languageCode = "en";
  const nextPage = "12";
  const context = null;
  const state = new State(
    accessToken,
    dateRange,
    languageCode,
    nextPage as any,
    context
  );

  expect(state.dateRange).toEqual(["2020-07-07", "2020-08-02"]);
  expect(accessToken).toEqual(state.accessToken);
  expect(languageCode).toEqual(state.languageCode);
  expect(state.nextPage).toEqual(12); // Handled to be a number
  expect(context).toEqual(state.context);
});

it("Tests the state (Sad)", () => {
  const dateRange = [new Date(), "2nd test"] as unknown as [Date, Date]; // Invalid Date
  const accessToken = { token: "fsf" }; // Invalid access token
  const languageCode = "bn";
  const nextPage = "sfdh";
  const context = null;
  const state = new State(
    accessToken as any,
    dateRange,
    languageCode as any, // Note: For escaping typescript error
    nextPage as any,
    context
  );

  expect(state.dateRange).toEqual(["2022-09-01", "2022-09-08"]); // Fallback to default date range
  expect(state.accessToken).toEqual({ token: "", auth_provider: "" }); // Error handled
  expect(state.languageCode).toEqual("en"); // fallback to default because invalid langcode given
  expect(state.nextPage).toEqual(null); // Invalid nextPage value is given. So, it is handled to be null
});
