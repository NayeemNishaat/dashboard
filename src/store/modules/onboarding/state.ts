import { SetupSummary } from "/src/api/interfaces";

export default class State {
  public setupSummary: SetupSummary;
  public introStep: number;
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
    this.introStep = 0;
    this.setupStep = 0;
  }
}
