import { Client, User } from "@/api/interfaces";

import { subDays, format } from "date-fns";
import { AuthToken, Context } from "@/api/interfaces";
export default class State {
  public accessToken: AuthToken;
  public dateRange: [string, string];
  public languageCode: string;
  public nextPage: string | null;
  public context: Context | null;
  constructor() {
    try {
      this.accessToken = JSON.parse(
        localStorage.getItem("access_token") ||
        `{"token":"","auth_provider":""}`
      );
    } catch (err) {
      localStorage.removeItem("access_token");
      this.accessToken = { token: "", auth_provider: "" };
    }
    try {
      this.context = JSON.parse(localStorage.getItem("context") || "{}");
    } catch (err) {
      localStorage.removeItem("context");
      this.context = null;
    }
    this.dateRange = [
      format(subDays(new Date(), 8), "yyyy-MM-dd"),
      format(subDays(new Date(), 1), "yyyy-MM-dd")
    ];
    this.languageCode = localStorage.getItem("lang") || "en";
    this.nextPage = null;
  }
}
