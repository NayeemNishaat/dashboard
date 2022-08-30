import { subDays, format } from "date-fns";
import { AuthToken, Context } from "@/api/interfaces";
export default class State {
  public accessToken: AuthToken;
  public dateRange: [string, string];
  public languageCode: string;
  public nextPage: string | null;
  public context: Context | null;
  constructor(
    accessToken: AuthToken,
    dateRange: [Date, Date],
    languageCode: string,
    nextPage: string | null,
    context: Context | null
  ) {
    try {
      this.accessToken = accessToken || `{"token":"","auth_provider":""}`;
    } catch (err) {
      this.accessToken = { token: "", auth_provider: "" };
    }
    try {
      this.context = context || null;
    } catch (err) {
      this.context = null;
    }
    this.dateRange = [
      format(subDays(new Date(dateRange[0]), 8), "yyyy-MM-dd"),
      format(subDays(new Date(dateRange[1]), 1), "yyyy-MM-dd")
    ];
    this.languageCode = languageCode || "en";
    this.nextPage = nextPage || null;
  }
}
