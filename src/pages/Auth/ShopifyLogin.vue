<template>
  <div class="centered-box">
    <loader-dots />
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import LoaderDots from "../../components/LoaderDots.vue";
export default {
  name: "ShopifyLogin",
  components: {
    LoaderDots
  },
  data() {
    return {
      error: false
    };
  },
  computed: {
    ...mapGetters(["context"]),
    ...mapGetters("onboarding", ["hasFinishedOnboarding"])
  },
  methods: {
    ...mapActions(["getContext", "setAccessToken"])
  },
  async mounted() {
    try {
      const token = window.location.hash.replace(/^#/, "");
      await this.setAccessToken({ token, auth_provider: "shopify" });
      await this.getContext();
      if (this.hasFinishedOnboarding) {
        this.$router.push({ name: "summary" });
      } else {
        this.$router.push({
          name: "onboarding"
        });
      }
    } catch (err) {
      Sentry.captureException(err);
      await this.$router.push({
        name: "login-failed"
      });
    }
  }
};
</script>
