<template>
  <div class="row justify-content-center justify-content-lg-start">
    <div class="col-12">
      <onboarding-header :title="title" :progress="progress" />
    </div>
    <div :class="formContainerClass">
      <signup-form v-if="step === 1" @submit="next" :platform="platform" />
      <other-step2 v-else-if="step === 2" @submit="next" />
      <other-success v-else />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import OnboardingHeader from "@/components/onboarding/OnboardingHeader.vue";
import SignupForm from "@/components/onboarding/SignupForm.vue";
import OtherStep2 from "@/components/onboarding/OtherStep2.vue";
import OtherSuccess from "@/components/onboarding/OtherSuccess.vue";

import * as Sentry from "@sentry/browser";

export default {
  props: {
    platform: {
      type: String,
      default: "custom",
    },
  },
  components: {
    OnboardingHeader,
    OtherStep2,
    OtherSuccess,
    SignupForm,
  },
  data() {
    return {
      step: 1,
    };
  },
  async mounted() {
    if (this.$store.getters.isLoggedIn) {
      this.step = 2;
    }

    if (this.$store.getters.client.type === "shopify") {
      // something went wrong
      await this.finishOnboarding();
      this.$router.push({ name: "summary" });
    }
  },
  computed: {
    progress() {
      if (this.step === 1) {
        return 50;
      } else {
        return 100;
      }
    },
    formContainerClass() {
      return {
        "form-container": true,
        "col-12": true,
        "col-sm-10": this.step === 1,
      };
    },
    title() {
      switch (this.step) {
        case 1:
          return this.$t("lets setup your account");
        case 2:
          return this.$t("let's connect datacue to your store");
        default:
          return this.$t("hooray");
      }
    },
  },
  methods: {
    ...mapActions("onboarding", ["finishOnboarding"]),
    next() {
      this.step += 1;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.password-rules {
  color: $gray-dark;
}

.password-strength {
  width: 160px;
  .status {
    color: #67c23a;

    &.good {
      color: #fdb809;
    }

    &.weak {
      color: #f56c6c;
    }
  }
}

.successForm {
  width: 100%;
  height: 100%;
  padding: 10em;
}
</style>
