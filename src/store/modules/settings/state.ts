import { PageInstallationSettings } from "/src/api/interfaces";
import {
  defaultHomepageSettings,
  defaultPageSettings
} from "../settings_helpers";

export default class State {
  public pageInstallationLoading: string | null;
  public pageInstallationSettings: PageInstallationSettings;
  constructor() {
    this.pageInstallationLoading = null;
    this.pageInstallationSettings = {
      home: defaultHomepageSettings,
      product: defaultPageSettings,
      category: defaultPageSettings,
      "404": defaultPageSettings,
      cart: defaultPageSettings,
      search: defaultPageSettings
    };
  }
}
