<template>
  <onboarding-step
    :title="$t('onboarding:billing:title')"
    show-back-button
    @back="$emit('back')"
  >
    <template v-slot:slideshow>
      <img
        class="screenshot"
        alt=""
        src="/src/assets/img/sign-up/slideshow/dashboard.jpg"
      />
    </template>

    <p>{{ $t("onboarding:billing:intro") }}</p>

    <template v-if="lastRevenue > 0">
      <p v-if="receivedRevenue">
        {{ $t("onboarding:billing:lastMonthRevenue", { amount: lastRevenue }) }}
      </p>

      <p v-else>
        <i18n tag="label" path="onboarding:billing:lastMonthGuess">
          <el-input-number
            place="amount"
            :min="10"
            :step="1000"
            size="small"
            controls-position="right"
            v-model="lastRevenue"
          />
        </i18n>
      </p>

      <p>
        {{
          $t(
            `onboarding:billing:${
              receivedRevenue ? "estimated" : "guess"
            }Earning`,
            {
              amount: lastRevenue + estimatedEarning
            }
          )
        }}
        <br />
        {{ $t("onboarding:billing:estimatedCost", { amount: estimatedCost }) }}
      </p>
    </template>

    <template v-else>
      <p>{{ $t("onboarding:billing:noRevenue") }}</p>
      <p>{{ $t("onboarding:billing:freeUntil") }}</p>
    </template>

    <template v-if="client.type !== 'shopify'">
      <p>{{ $t("onboarding:billing:activateCustom") }}</p>

      <el-collapse-transition>
        <p v-if="paymentsConfigured === false" class="setup-message error">
          {{ $t("onboarding:billing:paymentMethod") }}
        </p>
      </el-collapse-transition>
    </template>

    <template v-slot:actions>
      <dc-button
        type="primary"
        @click="handleActivateButton"
        :disabled="loading"
      >
        {{ $t("onboarding:billing:startTrialButton") }}
      </dc-button>

      <div class="guarantee">
        <i class="ti-check" />
        {{ $t("onboarding:billing:freeDays") }}
      </div>
    </template>

    <!-- <template v-slot:tip>
      <i18n path="onboarding:billing:contactUs">
        <dc-button
          place="contactUsButton"
          type="link"
          @click="contactDialogOpen = true"
        >
          {{ $t("onboarding:billing:contactUsButton") }}
        </dc-button>
      </i18n>
    </template>

    <el-dialog
      :visible.sync="contactDialogOpen"
      width="720px"
      :modal-append-to-body="false"
    >
      <el-form
        ref="contactForm"
        :model="contact"
        inline-message
        label-position="top"
        hide-required-asterisk
      >
        <el-form-item
          prop="revenue"
          :label="$t('onboarding:billing:chooseRevenue')"
          :rules="{
            required: true,
            message: $t('onboarding:billing:selectRange')
          }"
        >
          <el-select v-model="contact.revenue">
            <el-option v-for="range in ranges" :key="range" :value="range" />
          </el-select>
        </el-form-item>

        <el-form-item prop="comment" :label="$t('onboarding:billing:comment')">
          <el-input type="textarea" v-model="contact.comment" />
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <dc-button
          type="outline"
          @click="requestEnterprisePlan"
          :disabled="sending"
        >
          {{ $t("onboarding:billing:sendRequestButton") }}
        </dc-button>
      </template>
    </el-dialog> -->
  </onboarding-step>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";

import DcButton from "/src/components/DcButton.vue";
import OnboardingStep from "/src/components/onboarding/OnboardingStep.vue";

import {
  getPageData,
  selectPlan,
  postOnboardingNotification
} from "/src/api/backend";

export default {
  name: "OnboardingBilling",
  components: {
    DcButton,
    OnboardingStep
  },
  props: ["revenue"],
  data() {
    return {
      receivedRevenue: this.revenue !== null,
      lastRevenue:
        this.revenue === null ? 10000 : 10 * Math.round(this.revenue / 10),
      paymentsConfigured: null,
      contactDialogOpen: false,
      contact: {
        revenue: null,
        comment: ""
      },
      ranges: [
        "$125,000 – $200,000",
        "$200,000 – $300,000",
        "$300,000 – $400,000",
        "$400,000 – $500,000",
        "$500,000 – $600,000",
        this.$t("onboarding:billing:maxRevenue")
      ],
      loading: false,
      sending: false,
      planId: null,
      planPrice: null
    };
  },
  computed: {
    ...mapGetters(["client"]),
    estimatedEarning() {
      return Math.round(this.lastRevenue * 0.12);
    },
    estimatedCost() {
      const cost = this.estimatedEarning * 0.02;
      if (cost === Math.floor(cost)) {
        return cost;
      }

      return cost.toFixed(2);
    },
    budget() {
      const rounded = Math.round(+this.estimatedCost);
      return Math.max(49, Math.min(rounded, 99));
    }
  },
  methods: {
    ...mapActions("onboarding", ["finishOnboarding"]),
    handleActivateButton() {
      if (this.client.type === "shopify") {
        return this.setupBilling();
      }

      if (!this.chargebee) {
        return;
      }

      this.chargebee.createChargebeePortal().openSection(
        { sectionType: window.Chargebee.getPortalSections().PAYMENT_SOURCES },
        {
          close: async () => {
            this.loading = true;

            try {
              this.chargebee.logout();

              const res = await getPageData("billing");
              this.paymentsConfigured = res.payments_configured;

              if (this.paymentsConfigured) {
                this.setupBilling();
              } else {
                this.loading = false;
              }
            } catch (err) {
              Sentry.captureException(err);
              this.loading = false;
            }
          }
        }
      );
    },
    async setupBilling() {
      this.loading = true;

      try {
        if (this.planId) {
          await selectPlan(
            this.planId,
            Math.max(0, this.budget - this.planPrice)
          );
          const res = await getPageData("billing");
          const { active, pending } = res.subscriptions;

          if (
            (active && active.plan_id === this.planId) ||
            (pending && pending.plan_id === this.planId)
          ) {
            await postOnboardingNotification({
              type: "onboarding_finish"
            });

            await this.finishOnboarding();
            if (this.client.type === "shopify") {
              window.location =
                import.meta.env.VITE_APP_SHOPIFY_INSTALL_URL.replace(
                  /install$/,
                  `?shop=${this.client.apikey}`
                );
            } else {
              this.$emit("done");
            }
          }
        }
      } catch (err) {
        Sentry.captureException(err);
        this.loading = false;
      }
    },
    async requestEnterprisePlan() {
      this.sending = true;

      try {
        if (await this.$refs.contactForm.validate()) {
          await postOnboardingNotification({
            type: "enterprise_plan_request",
            details: this.contact
          });

          await this.finishOnboarding();
          this.$emit("done");
        }
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.sending = false;
      }
    }
  },
  async mounted() {
    this.loading = true;

    try {
      await postOnboardingNotification({
        type: "billing_step",
        details: this.receivedRevenue
          ? { revenue: this.lastRevenue.toString() }
          : undefined
      });
    } catch (err) {
      Sentry.captureException(err);
    }
    try {
      await this.$loadScript("https://js.chargebee.com/v2/chargebee.js");
      this.chargebee = window.Chargebee.init({
        site: import.meta.env.VITE_APP_CHARGEBEE_DOMAIN
      });
      this.chargebee.setPortalSession(() => getPageData("billing/portal"));

      const res = await getPageData("billing");
      if (res.subscriptions && res.subscriptions.active) {
        await postOnboardingNotification({
          type: "onboarding_finish"
        });

        await this.finishOnboarding();
        this.$emit("done");
      } else {
        const plan = res.available_plans.find(
          (plan) => +plan.commission_percent === 2
        );

        this.planId = plan.plan_id;
        this.planPrice = +plan.price;
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
@import "/src/assets/sass/datacue/_colors.scss";

.screenshot {
  width: 100%;
}

.el-input-number.is-controls-right {
  &.el-input-number--small {
    width: 108px;
  }

  &.el-input-number--mini {
    width: 72px;
  }

  :deep {
    .el-input--small {
      font-size: inherit;
    }

    .el-input__inner {
      padding-left: 2px;
      padding-right: 32px;
    }
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

.guarantee {
  display: inline-block;

  i {
    margin-right: 0.5em;
    color: #6da08d;
  }
}
</style>
