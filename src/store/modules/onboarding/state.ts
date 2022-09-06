import { SetupSummary } from "@/api/interfaces";

export default class State {
  public setupSummary: SetupSummary;
  public setupStep: number;
  constructor() {
    this.setupSummary = {
      store_data: {
        has_products_categories: false,
        orders: 0
      },
      banners_uploaded: {
        main: 0,
        sub: 0
      },
      algo_completed: {
        main_banners: [],
        sub_banners: [],
        products: false
      }
    };
    this.setupStep = 0;
  }
}
