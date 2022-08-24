<template>
  <div class="onboarding-panel">
    <card>
      <template v-slot:header>
        <h2>{{ $t("onboarding:setup:custom") }}</h2>
      </template>
      <i18n tag="p" path="onboarding:setup:connect">
        <template v-slot:installLink>
          <a target="_blank" :href="guideLink">{{
            $t(
              `onboarding:setup:${
                pluginAvailable ? "installPlugin" : "connectApi"
              }`
            )
          }}</a>
        </template>
        <template v-slot:platform>
          <span>{{ platformFriendly }}</span>
        </template>
      </i18n>
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

      <el-collapse-transition>
        <div v-if="verificationResult">
          <ul class="imported">
            <li>
              <i
                :class="`ti-${
                  verificationResult.categories ? 'check' : 'alert'
                }`"
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
              <i
                :class="`ti-${verificationResult.orders ? 'check' : 'alert'}`"
              />
              {{ $t("orders") }}:
              <strong>{{ verificationResult.orders }}</strong>
            </li>
            <li>
              <i
                :class="`ti-${verificationResult.users ? 'check' : 'alert'}`"
              />
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

      <dc-button type="outline" @click="verifySetup" :disabled="verifying">
        {{
          $t(
            `onboarding:setup:${verificationResult ? "verifyAgain" : "verify"}`
          )
        }}
      </dc-button>

      <div class="onboarding-step-tip">
        <i class="ti-light-bulb" />
        <p class="tip-contents">
          <i18n path="onboarding:setup:skipApiSetup">
            <template v-slot:scheduleCall>
              <dc-button place="scheduleCall" type="link" @click="showCalendly">
                {{ $t("onboarding:setup:scheduleCall") }}
              </dc-button>
            </template>
          </i18n>
        </p>
      </div>

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
    </card>
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapGetters } from "vuex";

import Card from "/src/components/Cards/Card.vue";
import DcButton from "/src/components/DcButton.vue";

import { getPageData, postOnboardingNotification } from "/src/api/backend.js";

export default {
  name: "OnboardingSetupCustom",
  components: {
    DcButton,
    Card,
  },
  data() {
    return {
      skipDialogOpen: false,
      verifying: false,
      verificationResult: null,
      calendlyLink: "https://calendly.com/get-datacue/demo",
    };
  },
  computed: {
    ...mapGetters(["client"]),
    platform() {
      if (this.client) {
        return this.client.type;
      }
      return this.$route.params.platform;
    },
    platformFriendly() {
      switch (this.platform) {
        case "woocommerce":
          return "WooCommerce";
        case "prestashop":
          return "Prestashop";
        case "magento":
          return "Magento";
      }
      return this.platform;
    },
    pluginAvailable() {
      return ["woocommerce", "prestashop", "magento"].includes(this.platform);
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
@import "/src/assets/sass/datacue/_colors.scss";
@import "/src/assets/css/calendly.css";

.slide-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/src/assets/img/datacue-logo-dark.svg") no-repeat center / 80%
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
.onboarding-step-tip {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  margin-top: 3em;
  border-top: 1px solid $primary;
  padding-top: 1em;
  color: $gray-dark;

  > i {
    font-size: 20px;
    color: $primary;
  }

  .tip-contents {
    margin: 0 0 0 1em;
    font-size: 14px;
  }
}
</style>
