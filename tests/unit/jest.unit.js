import { config } from "@vue/test-utils";
config.mocks["$t"] = msg => msg;
config.mocks["$tc"] = (msg, _) => msg;
