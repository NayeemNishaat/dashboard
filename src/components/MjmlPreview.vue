<template>
  <iframe
    ref="preview"
    class="preview-window"
    :class="`preview-window-${size}`"
    src="about:blank"
  ></iframe>
</template>

<script>
import fill from "lodash/fill";
import throttle from "lodash/throttle";
import mjml2html from "mjml4-in-browser";
import * as Sentry from "@sentry/browser";

import { getPageData } from "/src/api/backend";
import {
  isValidTemplateType,
  buildTemplateMjml
} from "/src/api/template-builder";

function shortenToWordBoundary(originalStr, n) {
  if (originalStr.length <= n) {
    return originalStr;
  }
  var subString = originalStr.substr(0, n - 1);
  return subString.substr(0, subString.lastIndexOf(" ")) + "...";
}

export default {
  name: "MjmlPreview",
  data: function () {
    return {
      resizeInterval: null,
      products: fill(Array(6), {
        photo_url: "https://via.placeholder.com/300x260",
        name: "Example product",
        link: "https://demo.datacue.co/",
        price: "1250",
        full_price: "2000"
      })
    };
  },
  props: {
    template: {
      type: String,
      validator: isValidTemplateType
    },
    size: {
      type: String,
      validator: (v) => ["mobile", "desktop"].includes(v)
    },
    editorState: {
      type: Object,
      required: true
    }
  },
  watch: {
    editorState: {
      handler: "updatePreview",
      deep: true
    }
  },
  methods: {
    updatePreview: throttle(function () {
      const compiled = mjml2html(
        buildTemplateMjml(this.template, {
          content: this.editorState.content,
          settings: {
            ...this.editorState.settings,
            ...this.$store.getters.client.web_settings.recommendations.all
          },
          products: this.products
        })
      );

      if (!compiled.errors || !compiled.errors.length) {
        const { preview } = this.$refs;
        const { html } = compiled;

        if (preview.srcdoc && preview.contentDocument.body) {
          const bodyStart = html.match(/<body>/);
          const bodyEnd = html.match(/<\/body>/);

          preview.contentDocument.body.innerHTML = html.substring(
            bodyStart.index + bodyStart[0].length,
            bodyEnd.index
          );
        } else {
          preview.srcdoc = html;
        }
      } else {
        Sentry.withScope((scope) => {
          scope.setExtra("error_log", compiled.errors);
          Sentry.captureException(new Error("MJML compilation error"));
        });
      }
    }, 100),
    resizePreview() {
      const { preview } = this.$refs;
      const frameDocument = preview.contentDocument;

      if (frameDocument && frameDocument.body) {
        const { height } = frameDocument.body.getBoundingClientRect();

        preview.style.height = Math.ceil(height) + 20 + "px";
      }
    }
  },
  mounted() {
    this.updatePreview();
    this.resizeInterval = window.setInterval(this.resizePreview, 200);

    getPageData("products/random").then((res) => {
      this.products = res.products.map((elem) => {
        elem.name = shortenToWordBoundary(elem.name, 25);
        return elem;
      });
      this.updatePreview();
    });
  },
  beforeUnmount() {
    window.clearInterval(this.resizeInterval);
  }
};
</script>

<style scoped>
.preview-window {
  box-sizing: content-box;
  display: block;
  width: 100%;
  min-width: 320px;
  max-width: 600px;
  min-height: 600px;
  border: 1px solid #80848e;
  background-color: white;
}

.preview-window-mobile {
  width: 320px;
  max-height: 1000px;
}

.preview-window-desktop {
  width: 600px;
  overflow: hidden;
}
</style>
