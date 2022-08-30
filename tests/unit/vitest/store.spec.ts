import { assert, describe, it, expect } from "vitest";
import mutations from "./mocks/mutation";
import State from "./mocks/state";

it("Sets a date range!", () => {
  const newRange = ["2020-07-15", "2020-08-03"];
  const state = new State(
    { token: "gdg", auth_provider: "fdg" },
    ["2020-05-07" as unknown as Date, "2020-05-15" as unknown as Date],
    "en",
    null,
    null
  );
  mutations.setDateRange(state, newRange);

  expect(newRange).toEqual(state.dateRange);
});
