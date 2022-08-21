<template>
  <div class="centered-box">
    <card-message-box type="error">
      <h3>{{ $t("login-error-title") }}</h3>
      <div v-if="isShopify" v-html="$t('login-error-shopify-html')"></div>
      <div v-else v-html="$t('login-error-non-shopify-html')"></div>
      <p v-if="isSafari">{{ $t("try-chrome-ff") }}</p>
    </card-message-box>
  </div>
</template>

<script>
import CardMessageBox from "@/components/Cards/CardMessageBox.vue";

export default {
  name: "LoginError",
  components: {
    CardMessageBox
  },
  data() {
    return {
      isSafari: false,
      isShopify: true
    };
  },
  mounted() {
    this.isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf("CriOS") == -1 &&
      navigator.userAgent.indexOf("FxiOS") == -1;
    let platform = "shopify";
    try {
      window.localStorage.getItem("platform") || "shopify";
    } catch {
      platform = "shopify";
    }
    this.isShopify = platform == "shopify";
  }
};
</script>
