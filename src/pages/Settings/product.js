export const userGuideLinks = {
  en: {
    recent: "https://help.datacue.co/guide/products.html#recently-viewed",
    related:
      "https://help.datacue.co/guide/products.html#product-based-recommendations",
    user_related:
      "https://help.datacue.co/guide/products.html#related-products",
    similar:
      "https://help.datacue.co/guide/products.html#similar-to-current-product"
  },
  es: {
    recent:
      "https://help.datacue.co/es/guide/products.html#_4-productos-vistos-recientemente",
    related:
      "https://help.datacue.co/es/guide/products.html#_2-productos-relacionados-al-producto",
    user_related:
      "https://help.datacue.co/es/guide/products.html#_1-productos-relacionados-al-visitante",
    similar:
      "https://help.datacue.co/es/guide/products.html#_3-productos-similares-al-producto"
  }
};
export const titlePlaceholders = {
  en: {
    recent: "Recently viewed",
    related: "Recommended for you",
    similar: "Similar products",
    top: "Top products"
  },
  es: {
    recent: "Productos que viste hace poco",
    related: "Recomendaciones para ti",
    similar: "Productos similares",
    top: "Productos Top"
  }
};
export const productFields = [
  "price",
  "full_price",
  "brand",
  "rating",
  "stock"
];
export const aspectRatios = [
  [9, 16],
  [2, 3],
  [3, 4],
  [1, 1],
  [4, 3],
  [3, 2],
  [16, 9]
];
export const defaultProductSettings = {
  pct_promote_discounts: 0,
  section_layout: "grid",
  hide_out_of_stock: true,
  section_size: 8,
  context: {
    recent: {
      active: true,
      title: "",
      enabled: {
        home: true,
        product: true,
        category: true,
        search: true,
        "404": true,
        cart: true
      }
    },
    related: {
      active: true,
      title: "",
      enabled: {
        product: true
      }
    },
    user_related: {
      active: true,
      title: "",
      enabled: {
        home: true,
        "404": true,
        cart: true
      }
    },
    user_related_categories: {
      active: true,
      title: "",
      enabled: {
        home: true
      },
      sections: 2
    },
    similar: {
      active: true,
      title: "",
      enabled: {
        product: true
      }
    },
    top: {
      active: true,
      title: "",
      enabled: {
        category: true
      }
    }
  },
  cta_button: {
    show_button: false,
    caption: "Add to cart",
    buy_caption: "Buy",
    classes: ""
  },
  show_fields: ["price", "full_price"],
  custom_styles: {
    header: {
      active: false,
      color: null,
      "text-align": "left",
      "font-size": 24,
      "font-weight": 600,
      "text-transform": "none",
      decorations: {
        active: false,
        "border-bottom-width": 1,
        "border-color": null
      }
    },
    photo: {
      active: false,
      "border-width": 1,
      "border-color": "#cccccc",
      padding: 10,
      proportions: {
        active: false,
        "aspect-ratio": "1/1"
      }
    },
    tag: {
      active: false,
      style: "classic",
      color: null,
      "background-color": null
    },
    title: {
      active: false,
      color: null,
      "font-size": 16,
      "font-weight": 400,
      "text-align": "left",
      "text-transform": "none"
    },
    price: {
      active: false,
      "text-align": "left",
      current: {
        color: null,
        "font-size": 16,
        "font-weight": 400
      },
      full: {
        color: null,
        "font-size": 16,
        "font-weight": 400
      },
      discount: {
        color: null,
        "font-size": 16,
        "font-weight": 400
      }
    },
    layout: {
      active: false,
      show_next_item: true,
      items_per_page: {
        mobile: 2,
        desktop: 4
      },
      advanced: {
        active: false,
        spacing: 2,
        "max-width": 1200
      }
    }
  }
};
