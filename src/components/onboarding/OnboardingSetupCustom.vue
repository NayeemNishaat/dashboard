<template>
  <onboarding-step
    :title="$t(`onboarding:setup:custom`)"
    show-back-button
    @back="$emit('back')"
  >
    <template v-slot:slideshow>
      <div class="slide-logo" />
    </template>

    <p>{{ $t("onboarding:setup:credentials") }}</p>

    <el-form label-position="left" label-width="120px">
      <el-form-item label="API key">
        <el-input type="text" readonly :value="client.apikey">
          <template v-slot:append>
            <dc-button type="outline" @click="$clipboard(client.apikey)"
              ><i class="ti-files"></i>&nbsp;&nbsp;{{ $t("copy") }}</dc-button
            >
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="API secret">
        <el-input type="text" readonly :value="atob(client.apisecret)">
          <template v-slot:append>
            <dc-button
              type="outline"
              @click="$clipboard(atob(client.apisecret))"
              ><i class="ti-files"></i>&nbsp;&nbsp;{{ $t("copy") }}</dc-button
            >
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <i18n tag="p" path="onboarding:setup:connect">
      <a place="installLink" target="_blank" :href="guideLink">{{
        $t(
          `onboarding:setup:${pluginAvailable ? "installPlugin" : "connectApi"}`
        )
      }}</a>
    </i18n>

    <el-collapse-transition>
      <div v-if="verificationResult">
        <ul class="imported">
          <li>
            <i
              :class="`ti-${verificationResult.categories ? 'check' : 'alert'}`"
            />
            {{ $tc("categories", 2) }}:
            <strong>{{ verificationResult.categories }}</strong>
          </li>
          <li>
            <i
              :class="`ti-${
                verificationResult.products.products ? 'check' : 'alert'
              }`"
            />
            {{ $tc("products", 2) }}:
            <strong>{{ verificationResult.products.products }}</strong>

            ({{
              $t("onboarding:setup:variants", {
                count: verificationResult.products.variants,
              })
            }})
          </li>
          <li>
            <i :class="`ti-${verificationResult.orders ? 'check' : 'alert'}`" />
            {{ $t("orders") }}:
            <strong>{{ verificationResult.orders }}</strong>
          </li>
          <li>
            <i :class="`ti-${verificationResult.users ? 'check' : 'alert'}`" />
            {{ $tc("users", 2) }}:
            <strong>{{ verificationResult.users }}</strong>
          </li>
        </ul>

        <p
          class="setup-message"
          :class="{ success: setupDone, error: !setupDone }"
        >
          {{ $t(`onboarding:setup:import${setupDone ? "Done" : "Failed"}`) }}
        </p>
      </div>
    </el-collapse-transition>

    <template v-slot:actions>
      <dc-button type="outline" @click="verifySetup" :disabled="verifying">
        {{
          $t(
            `onboarding:setup:${verificationResult ? "verifyAgain" : "verify"}`
          )
        }}
      </dc-button>

      <dc-button
        v-if="verificationResult"
        type="primary"
        @click="$emit('done')"
      >
        {{ $t("onboarding:setup:goToBilling") }}
      </dc-button>
    </template>

    <template v-slot:tip>
      <i18n path="onboarding:setup:skipApiSetup">
        <dc-button place="scheduleCall" type="link" @click="showCalendly">
          {{ $t("onboarding:setup:scheduleCall") }}
        </dc-button>
        <dc-button place="skip" type="link" @click="skipDialogOpen = true">
          {{ $t("onboarding:setup:skip") }}
        </dc-button>
      </i18n>
    </template>

    <el-dialog
      :visible.sync="skipDialogOpen"
      width="720px"
      :modal-append-to-body="false"
    >
      <template v-slot:title>
        <h2>{{ $t("onboarding:setup:areYouSure") }}</h2>
      </template>

      <template v-slot:footer>
        <div class="dialog-actions">
          <dc-button type="outline" @click="skipDialogOpen = false">
            {{ $t("onboarding:setup:continue") }}
          </dc-button>

          <dc-button type="link" @click="$emit('done')">
            {{ $t("onboarding:setup:skipForNow") }}
          </dc-button>
        </div>
      </template>
    </el-dialog>
  </onboarding-step>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapGetters } from "vuex";

import DcButton from "@/components/DcButton.vue";
import OnboardingStep from "@/components/onboarding/OnboardingStep.vue";

import { getPageData, postOnboardingNotification } from "@/api/backend.js";

export default {
  name: "OnboardingSetupCustom",
  components: {
    DcButton,
    OnboardingStep,
  },
  props: {
    platform: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      skipDialogOpen: false,
      verifying: false,
      verificationResult: null,
      calendlyLink: "https://calendly.com/shrumm/datacue-demo",
    };
  },
  computed: {
    ...mapGetters(["client"]),
    pluginAvailable() {
      return ["woocommerce", "prestashop"].includes(this.platform);
    },
    guideLink() {
      if (this.pluginAvailable) {
        let base = "https://help.datacue.co/";
        if (this.$i18n.locale === "es") {
          base += "es/";
        }
        return `${base}/install/${this.platform}.html`;
      }

      return "https://developer.datacue.co/";
    },
    setupDone() {
      const { verificationResult: v } = this;

      if (!v) {
        return false;
      }

      return v.categories && v.products.products && v.orders && v.users;
    },
  },
  methods: {
    atob(val) {
      return atob(val);
    },
    async verifySetup() {
      this.verifying = true;

      try {
        this.verificationResult = await getPageData("client/overview");
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.verifying = false;
      }
    },
    showCalendly() {
      this.calendly.initPopupWidget({
        url: this.calendlyLink,
        prefill: {
          name: this.client.user_name,
          email: this.client.email,
        },
      });
    },
    handleCalendlyEvent(event) {
      if (event.data.event === "calendly.event_scheduled") {
        postOnboardingNotification({
          type: "call_request",
        });

        this.$emit("done");
      }
    },
  },
  mounted() {
    this.$loadScript("https://calendly.com/assets/external/widget.js").then(
      () => {
        this.calendly = window.Calendly;
      }
    );

    window.addEventListener("message", this.handleCalendlyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.handleCalendlyEvent);
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";
@import "@/assets/css/calendly.css";

.slide-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/img/datacue-logo-dark.svg") no-repeat center / 80%
    #fff;
}

.dialog-actions {
  display: flex;
  flex-flow: row nowrap;

  > :not(:last-child) {
    margin-right: 1em;
  }
}

.imported {
  list-style-type: none;
  padding: 0 0 0 1em;
  border-left: 1px solid $primary;

  i {
    margin-right: 0.5em;
  }
}

.setup-message {
  padding: 1em 1.5em;

  &.success {
    border-left: 1px solid #6da08d;
    background: #e1fbf0;
  }

  &.error {
    border-left: 1px solid #ad7775;
    background: #f9eded;
  }
}
</style>
