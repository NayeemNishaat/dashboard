<template>
  <div class="onboarding-content">
    <div class="row">
      <div class="col-12">
        <div class="billing-panel mx-auto">
          <card>
            <h1>{{ $t("onboarding:billing:title") }}</h1>
            <p>{{ $t("onboarding:billing:intro") }}</p>
          </card>
          <card v-if="loading">
            <loader-dots></loader-dots>
          </card>
          <template v-else>
            <card v-if="client.type !== 'shopify' && !paymentsConfigured">
              <p>{{ $t("onboarding:billing:activateCustom") }}</p>

              <el-collapse-transition>
                <p
                  v-if="paymentsConfigured === false"
                  class="setup-message error"
                >
                  {{ $t("onboarding:billing:paymentMethod") }}
                </p>
              </el-collapse-transition>
              <dc-button
                type="primary"
                @click="addPaymentMethod"
                :disabled="loading"
              >
                {{ $t("onboarding:billing:addPaymentMethod") }}
              </dc-button>
            </card>
            <template v-else>
              <pricing-plans
                :available-plans="availablePlans"
                @selectplan="processPlanSection"
              />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";
import Card from "/src/components/Cards/Card.vue";

import PricingPlans from "/src/components/Billing/PricingPlans.vue";
import LoaderDots from "/src/components/LoaderDots.vue";
import DcButton from "/src/components/DcButton.vue";

import {
  getPageData,
  selectPlan,
  postOnboardingNotification
} from "/src/api/backend";

export default {
  name: "ActivateBillingPlan",
  components: {
    DcButton,
    PricingPlans,
    LoaderDots,
    Card
  },
  props: ["revenue"],
  data() {
    return {
      receivedRevenue: this.revenue !== null,
      lastRevenue:
        this.revenue === null ? 10000 : 10 * Math.round(this.revenue / 10),
      availablePlans: null,
      paymentsConfigured: null,
      loading: false,
      sending: false,
      planId: null,
      planPrice: null
    };
  },
  computed: {
    ...mapGetters(["client"])
  },
  methods: {
    ...mapActions("onboarding", ["finishOnboarding"]),
    addPaymentMethod() {
      if (!this.chargebee) {
        return;
      }
      this.chargebee.createChargebeePortal().openSection(
        { sectionType: window.Chargebee.getPortalSections().PAYMENT_SOURCES },
        {
          paymentSourceAdd: async () => {
            this.loading = true;
            try {
              const res = await getPageData("billing");
              this.paymentsConfigured = res.payments_configured;
            } catch (err) {
              Sentry.captureException(err);
            } finally {
              this.loading = false;
            }
          },
          close: async () => {
            if (this.paymentsConfigured) {
              return;
            }
            this.loading = true;

            try {
              this.chargebee.logout();
              const res = await getPageData("billing");
              this.paymentsConfigured = res.payments_configured;
            } catch (err) {
              Sentry.captureException(err);
            } finally {
              this.loading = false;
            }
          }
        }
      );
    },
    processPlanSection(plan) {
      this.planId = plan.plan_id;
      this.planPrice = plan.price;
      return this.setupBilling();
    },
    async setupBilling() {
      this.loading = true;

      try {
        if (this.planId) {
          await selectPlan(this.planId, 0);
          const res = await getPageData("billing");
          const { active, pending } = res.subscriptions;
          if (
            (active && active.plan_id === this.planId) ||
            (pending && pending.plan_id === this.planId)
          ) {
            const plan = this.availablePlans.find(
              (plan) => plan.plan_id === this.planId
            );

            await postOnboardingNotification({
              type: "onboarding_finish",
              details: { plan_info: `${plan.name} (${plan.price} /mo)` }
            });
            await this.finishOnboarding();
            if (this.client.type !== "shopify") {
              this.$notify({
                title: this.$t("success"),
                message: this.$t("plan updated"),
                type: "success"
              });
              this.$router.push({ name: "setup-summary" });
              return;
            }
            window.location =
              import.meta.env.VITE_APP_SHOPIFY_INSTALL_URL.replace(
                /install$/,
                `?shop=${this.client.apikey}`
              );
          }
        }
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.loading = false;
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
        this.$router.push({ name: "loading" });
      } else {
        this.availablePlans = res.available_plans
          .map((elem) => {
            elem.products = elem?.products?.personalization ?? {};
            return elem;
          })
          .filter((plan) => !plan.annual)
          .sort((lhs, rhs) => lhs.price - rhs.price);
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

.setup-panel {
  min-width: 960px;
  max-width: 1024px;
}
.panel {
  height: 100%;
  margin: 0 0 1.5em;
  padding: 2% 4%;
  background: url("/src/assets/img/sign-up/slideshow/waves.svg") center / cover,
    #fdd367;
}
header {
  padding: 10px 0px;
  display: flex;
  justify-content: right;
}
.pages {
  line-height: 2;
  list-style-type: none;

  i {
    margin-right: 0.5em;
  }
}
.billing-panel {
  padding: 10px;
}
</style>
