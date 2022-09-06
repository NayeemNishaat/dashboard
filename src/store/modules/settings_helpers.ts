import { PageStatus, PageSettings } from "@/api/interfaces";

export const defaultHomepageSettings: PageSettings = {
  library: true,
  banners: true,
  products: true,
  static_banner: {
    link: "",
    photo_url: ""
  },
  integrations: {
    judgeme: false,
    loox: false
  }
};

export const getPageStatus = (status = "unknown"): PageStatus => {
  return {
    home: status,
    product: status,
    category: status,
    search: status,
    "404": status,
    cart: status
  };
};

export const defaultPageSettings: PageSettings = {
  library: true,
  products: true
};
