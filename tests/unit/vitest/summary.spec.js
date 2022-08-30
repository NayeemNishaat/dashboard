import mutations from "@/store/mutations";
import State from "@/store/state";
import { assert, describe, it, expect } from "vitest";
// import { mockAuthenticatedClients, webSettings } from "./mocks/store";

it("Sets a date range!", () => {
  const newRange = ["2020-07-15", "2020-08-03"];
  const state = {
    dateRange: ["2020-05-07", "2020-05-15"]
  };

  mutations.setDateRange(state, newRange);
  console.log(12345);
  // expect(newRange).toEqual(State.dateRange);
});