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
    languageCode: "en" | "es",
    nextPage: string | null,
    context: Context | null
  ) {
    try {
      if (!accessToken.token || !accessToken.auth_provider) throw new Error();

      this.accessToken = accessToken || `{"token":"","auth_provider":""}`;
    } catch (err) {
      this.accessToken = { token: "", auth_provider: "" };
    }
    try {
      this.context = context || null;
    } catch (err) {
      this.context = null;
    }
    try {
      if (isNaN(dateRange[0] as any) || isNaN(dateRange[1] as any)) {
        this.dateRange = [
          format(subDays(new Date(), 8), "yyyy-MM-dd"),
          format(subDays(new Date(), 1), "yyyy-MM-dd")
        ];
      }

      this.dateRange = [
        format(subDays(new Date(dateRange[0]), 8), "yyyy-MM-dd"),
        format(subDays(new Date(dateRange[1]), 1), "yyyy-MM-dd")
      ];
    } catch (error) {
      this.dateRange = [
        format(subDays(new Date(), 8), "yyyy-MM-dd"),
        format(subDays(new Date(), 1), "yyyy-MM-dd")
      ];
    }

    const regex = new RegExp(/en|es/);
    if (regex.test(languageCode)) this.languageCode = languageCode;
    else this.languageCode = "en";

    this.nextPage = nextPage || null;
  }
}
