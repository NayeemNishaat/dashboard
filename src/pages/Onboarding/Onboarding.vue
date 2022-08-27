<template>
  <div class="onboarding">
    <header class="onboarding-header">
      <dc-steps class="onboarding-steps">
        <dc-step v-for="step in steps" :key="step" :title="$t(`onboarding:step:${step}`)" :done="isStepDone(step)"
          :active="step === $route.meta.step" />
      </dc-steps>

      <a class="header-logo">
        <img alt="DataCue" src="@/assets/img/datacue-logo-dark.svg" />
      </a>
    </header>

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
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.onboarding {
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  color: $dark;

  :deep {
    h1 {
      margin: 0;
      font-family: inherit;
      font-size: 39px;
      font-weight: 700;
    }

    h2 {
      margin: 0;
      font-family: inherit;
      font-size: 31px;
      font-weight: 700;
    }

    p {
      margin: 1em 0;

      &+p {
        margin-top: 2em;
      }
    }

    label {
      margin: 0;
      font-size: inherit;
    }

    label.el-radio {
      font-size: 14px;
      margin-right: 15px;
    }

    a {
      color: inherit;
      text-decoration: underline;

      &:hover,
      &:focus {
        color: $primary;
      }
    }

    >.loader.dots {
      align-self: center;
      margin: auto;
    }
  }
}

.onboarding-header {
  flex: 0 0 auto;
  display: grid;
  grid-template: 100% / 1fr auto 1fr;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-bottom: 1px solid $gray-light;
  padding: 1em 2em;
}

.onboarding-steps {
  grid-column: 2;
}

.header-logo {
  height: 50%;
  margin-left: auto;
  justify-self: end;

  >img {
    height: 100%;
  }
}

.onboarding-step-wrapper {
  overflow: hidden;
  flex: 1 1 auto;
}

.onboarding-content {
  min-height: calc(100vh - 80px);
  padding: 2% 4%;
  background: url("@/assets/img/sign-up/slideshow/waves.svg") center / cover,
    #fdd367;
}
</style>
<style>
.onboarding-panel {
  background-color: #f4f3ef;
  padding: 10px;
}
</style>
