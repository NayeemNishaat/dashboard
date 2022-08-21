<template>
  <iframe ref="preview" class="preview-window" src="about:blank"></iframe>
</template>

<script>
import throttle from "lodash/throttle";
import * as Sentry from "@sentry/browser";
const exampleNames = [
  "Small Green Cactus",
  "Flexible Desk Lamp",
  "Fancy Retro Bulbs",
  "Outdoor Armchair",
  "All Weather Sofa",
  "Wooden Banana Hanger"
];

const exampleBrands = [
  "Plant Factory",
  "Light & Co.",
  "Light & Co.",
  "Bequem GmbH",
  "Bequem GmbH",
  "Superfluous Inc"
];

export default {
  name: "ProductsPreview",
  computed: {
    staging() {
      return (
        process.env.VUE_APP_URL.includes("staging") ||
        process.env.VUE_APP_URL.includes("localhost")
      );
    },
    products() {
      return [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4]
        .slice(0, this.productCount)
        .map((i, j) => ({
          product_id: j,
          variant_id: j,
          name: exampleNames[i - 1],
          price: i * 150 - 1,
          full_price: i > 3 ? i * i * 80 - 1 : undefined,
          link: "#",
          photo_url: `https://cdn.datacue.co/assets/css-editor/${i}.jpg`,
          rating: 50 + 5 * i,
          brand: exampleBrands[i - 1],
          stock: i % 2 ? 10 : 3
        }));
    }
  },
  props: {
    styles: {
      type: Object,
      required: true
    },
    showFields: {
      type: Array
    },
    apiKey: {
      type: String,
      required: true
    },
    productCount: {
      type: Number,
      default: 8
    },
    type: {
      type: String,
      default: "grid"
    }
  },
  watch: {
    styles: {
      handler: "updatePreview",
      deep: true
    },
    showFields: "refreshPreview",
    productCount: "refreshPreview",
    type: "refreshPreview"
  },
  methods: {
    refreshPreview: throttle(function() {
      /* eslint-disable no-useless-escape */
      this.$refs.preview.srcdoc = `
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>DataCue Preview</title>
          <style>
            html { font-family: sans-serif }
            body { max-width: 1200px; margin: auto; padding: 20px; }
          </style>
          <script>
            window.datacueConfig = {
              api_key: '${this.apiKey}',
              page_type: 'editor preview',
              options: {
                _staging: ${this.staging}
              },
              editor: {
                custom_styles: ${JSON.stringify(this.styles)}
              }
            };
          <\/script>
          <script src="https://cdn.datacue.co/js/datacue.js"><\/script>
          <script>
            var __track = window.datacue.track.bind(window.datacue);
            window.datacue.track = function(event, defer) {
              return __track(event, defer).then(function(res) {
                res.config.products.section_layout = ${JSON.stringify(
                  this.type
                )};
                res.config.products.show_fields = ${JSON.stringify(
                  this.showFields || undefined
                )};
                res.recent_product_skus = ${JSON.stringify(this.products)}
                return res;
              });
            }
          <\/script>
          <script src="https://cdn.datacue.co/js/datacue-storefront.js"><\/script>
        </head>
        <body>
          <div data-dc-products></div>
        </body>
        </html>`;
      /* eslint-enable no-useless-escape */
    }, 250),
    updatePreview: throttle(function(newStyles, oldStyles) {
      const { preview } = this.$refs;
      if (
        preview.contentWindow &&
        preview.contentWindow.datacueConfig &&
        this.styles
      ) {
        try {
          preview.contentWindow.datacueConfig.editor.custom_styles = JSON.parse(
            JSON.stringify(this.styles)
          );
        } catch (err) {
          Sentry.captureException(err);
        }

        preview.contentDocument.dispatchEvent(
          new CustomEvent("datacue:editor:updated")
        );

        if (
          JSON.stringify(newStyles.slider) !== JSON.stringify(oldStyles.slider)
        ) {
          preview.contentDocument.dispatchEvent(
            new CustomEvent("datacue:editor:reload")
          );
        }
      }
    }, 250)
  },
  mounted() {
    this.refreshPreview();
  }
};
</script>

<style scoped>
.preview-window {
  display: block;
  width: 100%;
  height: 500px;
  margin: 20px 0;
  border: 1px solid #80848e;
  background-color: white;
}
</style>
