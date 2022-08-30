<template>
  <div class="onboarding">
    <loader-dots v-if="loading" />
    <div v-else class="onboarding-step-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import LoaderDots from "@/components/LoaderDots.vue";
import DcSteps from "@/components/DcSteps.vue";
import DcStep from "@/components/DcStep.vue";

import { getPageData, updatePartnerId } from "@/api/backend.js";
import { getCookieByName } from "@/api/cookies.js";
import { onUnmounted } from "vue";

export default {
  name: "Onboarding",
  components: {
    LoaderDots,
    DcSteps,
    DcStep
  },
  data() {
    const steps = ["signup", "intro", "setup", "billing"];
    if (this.$route.params.platform === "shopify") {
      //remove signup step for shopify
      steps.shift();
    }

    return {
      steps,
      loading: false,
      revenue: null
    };
  },
  computed: {
    ...mapGetters(["client", "isLoggedIn"]),
    ...mapGetters("onboarding", ["hasFinishedOnboarding"])
  },
  methods: {
    ...mapActions(["getContext", "setAccessToken"]),
    isStepDone(step) {
      return (
        this.steps.indexOf(step) <= this.steps.indexOf(this.$route.meta.step)
      );
    },
    async handleSignup(data) {
      try {
        await this.setAccessToken({
          token: data.token,
          auth_provider: "auth0"
        });
        await this.getContext();
        const platform = this.$route.params.platform;
        await this.$router.push({
          name: "onboarding-intro",
          params: { platform }
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    }
  },
  async mounted() {
    this.loading = true;
    this.$Tawk.$hideWidget();
    try {
      //is a partner cookie set?
      let partnerCode = getCookieByName("aff_id");
      if (partnerCode) {
        try {
          await updatePartnerId(partnerCode);
        } catch (err) {
          Sentry.captureException(err);
        }
      }

      if (this.$route.params.platform === "shopify") {
        if (!this.client || !this.client.apikey) {
          await this.getContext();
        }

        if (this.hasFinishedOnboarding) {
          await this.$router.push({ name: "loading" });
        } else {
          getPageData("client/shopify-revenue", { timeout: 90000 }).then(
            (res) => {
              if ("in_usd" in res) {
                this.revenue = res.in_usd;
              }
            }
          );
        }
        return;
      }
      //non-shopify clients
      if (this.isLoggedIn) {
        await this.getContext();
        const platform = this.$route.params.platform;
        await this.$router.push({
          name: "onboarding-intro",
          params: { platform }
        });
      }
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      this.loading = false;
    }
  },
  async onUnmounted() {
    this.$Tawk.$showWidget();
  }
};
</script>
