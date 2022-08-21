const basics = {
  banners: {
    banner_limit: 5,
    custom_layout: false,
    allowed_layouts: ["low"]
  },
  products: { recent: true }
};
const essentials = {
  banners: {
    banner_limit: 15,
    custom_layout: false,
    allowed_layouts: ["low", "medium", "high"]
  },
  products: { recent: true }
};
const standard = {
  banners: {
    banner_limit: 40,
    custom_layout: false,
    allowed_layouts: ["low", "medium", "high"]
  },
  products: {
    recent: true,
    user_related: true,
    related: true,
    top: true,
    user_related_categories: true,
    similar: true
  }
};
const premium = {
  banners: {
    banner_limit: 100,
    custom_layout: true,
    allowed_layouts: ["low", "medium", "high"]
  },
  products: {
    recent: true,
    user_related: true,
    related: true,
    top: true,
    user_related_categories: true,
    similar: true
  },
  ab_testing: true,
  notifications: true
};

export default {
  basics,
  essentials,
  standard,
  premium
};
