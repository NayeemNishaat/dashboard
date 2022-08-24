<template>
  <div>
    <div
      class="alerts-row row"
      v-if="!loading && pendingSubscription && isShopify"
    >
      <div class="col-sm-10">
        <el-alert
          :title="
            $t(
              'you have a pending billing change request that needs to be approved in Shopify'
            )
          "
          type="warning"
          effect="dark"
        ></el-alert>
      </div>
      <div class="col-sm-2">
        <dc-button type="primary" @click="refreshData()" icon="ti-reload">
          {{ $t("refresh") }}
        </dc-button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <card :title="$t('your subscription')">
          <loader-dots v-if="loading" />
          <div v-else-if="currentSubscription" class="card-padding">
            <p class="plan-name">{{ currentSubscription.plan }}</p>
            <p>
              <strong>{{ $t("started") }}:</strong>
              {{ format(currentSubscription.since) }}
            </p>
            <dc-button
              v-if="!isShopify"
              type="primary"
              @click="openChargebeePanel()"
            >
              {{ $t("manage billing info") }}
            </dc-button>
          </div>
          <div v-else class="card-padding">
            <p class="plan-name">
              {{ $t("no plan selected") }}
            </p>
            <dc-button
              v-if="!isShopify"
              type="primary"
              @click="openChargebeePanel()"
            >
              {{ $t("manage billing info") }}
            </dc-button>
          </div>
          <div v-if="!loading && pendingSubscription" class="card-padding">
            <p class="plan-name">
              {{ $t("pending") }}: {{ pendingSubscription.plan }}
            </p>
            <i18n
              tag="p"
              path="open app in {shopifyLink} to accept and activate"
              v-if="isShopify"
            >
              <a target="_blank" place="shopifyLink" :href="shopifyAppAdmin">
                {{ $t("shopify admin panel") }}
              </a>
            </i18n>
            <p v-else>{{ $t("accept payment to activate") }}</p>
          </div>
        </card>
      </div>
      <div class="col-sm-6 col-xs-12">
        <card
          :title="
            $t('current billing period') +
            (currentSubscription
              ? ` (${$t('since')} ${format(
                  currentSubscription.current_period_start
                )})`
              : '')
          "
        >
          <loader-dots v-if="loading" />
          <div v-else-if="currentSubscription" class="card-padding">
            <table v-if="parseInt(currentSubscription.commission_percent) > 0">
              <tr>
                <th>{{ $t("plan price") }}</th>
                <td>${{ +currentSubscription.price }}</td>
              </tr>
              <tr>
                <th>{{ $t("budget") }}</th>
                <td>
                  ${{
                    +currentSubscription.commission_cap +
                    +currentSubscription.price
                  }}
                </td>
              </tr>
              <tr>
                <th>{{ $t("conversions in usd") }}</th>
                <td class="conversions">${{ currentConversions }}</td>
              </tr>
              <tr>
                <th>
                  {{ $t("commission") }}
                  <span v-if="+currentSubscription.commission_percent > 0">{{
                    `${+currentSubscription.commission_percent}%`
                  }}</span>
                </th>
                <td>${{ commission }}</td>
              </tr>
              <tr class="total">
                <th>{{ $t("total") }}</th>
                <td>${{ +currentSubscription.price + commission }}</td>
              </tr>
            </table>

            <table v-else>
              <tr>
                <th>{{ $t("plan price") }}</th>
                <td>${{ +currentSubscription.price }}</td>
              </tr>
            </table>

            <i18n
              tag="p"
              path="you can view your invoices in the {shopifyLink}"
              v-if="isShopify"
            >
              <a target="_blank" place="shopifyLink" :href="shopifyAppAdmin">
                {{ $t("shopify admin panel") }}
              </a>
            </i18n>
          </div>
          <div v-else class="card-padding" />
        </card>
      </div>
    </div>
    <pricing-plans
      :available-plans="availablePlans"
      :disable-plan-selection="
        loading ||
        saving ||
        (!isShopify && !paymentsConfigured) ||
        !!pendingSubscription
      "
      :current-plan="currentSubscription"
      @selectplan="openBudgetDialog"
    />

    <el-dialog
      width="25%"
      append-to-body
      :title="$t('set your monthly budget')"
      :visible.sync="budgetDialogOpen"
    >
      <label class="budget-form">
        {{ $t("budget (usd)") }}
        <el-input-number size="small" v-model="budget" :min="budgetMin" />
      </label>
      <p class="budget-disclaimer">{{ $t("once your budget is reached") }}</p>
      <span slot="footer">
        <dc-button @click="budgetDialogOpen = false" type="outline">
          {{ $t("cancel") }}
        </dc-button>
        <dc-button @click="selectPlan(newPlan)" type="primary">
          {{ $t("save") }}
        </dc-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { differenceInCalendarDays, subDays, format, parseISO } from "date-fns";
import { mapGetters, mapActions } from "vuex";

import PricingPlans from "/src/components/Billing/PricingPlans.vue";
import Card from "/src/components/Cards/Card.vue";
import DcButton from "/src/components/DcButton.vue";
import LoaderDots from "/src/components/LoaderDots.vue";

import { getPageData, selectPlan } from "/src/api/backend";

export default {
  name: "Billing",
  components: {
    Card,
    DcButton,
    PricingPlans,
    LoaderDots
  },
  data() {
    return {
      loading: false,
      saving: false,
      budgetDialogOpen: false,
      budget: 0,
      budgetMin: 0,
      newPlan: null,
      currentSubscription: null,
      pendingSubscription: null,
      currentConversions: 0,
      last30DaysConversions: 0,
      availablePlans: [],
      chargebee: null,
      paymentsConfigured: null
    };
  },
  computed: {
    ...mapGetters(["client"]),
    isShopify: function () {
      return this.client.type === "shopify";
    },
    shopifyAppAdmin: function () {
      const { apikey } = this.client;
      return import.meta.env.VITE_APP_SHOPIFY_INSTALL_URL.replace(
        /install$/,
        `?shop=${apikey}`
      );
    },
    endsInDays: function () {
      if (!this.currentSubscription || !this.currentSubscription.until) {
        return null;
      }

      return differenceInCalendarDays(
        parseISO(this.currentSubscription.until),
        new Date()
      );
    },
    commission: function () {
      if (!this.currentSubscription) {
        return 0;
      }

      if (
        this.currentSubscription.commission_threshold > this.currentConversions
      ) {
        return 0;
      }

      return (
        (this.currentSubscription.commission_percent *
          (this.currentConversions -
            this.currentSubscription.commission_threshold)) /
        100
      );
    },
    bestPlan: function () {
      if (!this.availablePlans.length) {
        return null;
      }

      if (!this.last30DaysConversions) {
        return null;
      }

      const cost = (i) =>
        +this.availablePlans[i].price +
        (this.availablePlans[i].commission_percent *
          Math.max(
            0,
            this.last30DaysConversions -
              this.availablePlans[i].commission_threshold
          )) /
          100;

      let best = 0;
      for (let i = 1; i < this.availablePlans.length; ++i) {
        if (cost(i) <= cost(best)) {
          best = i;
        }
      }

      if (
        this.currentSubscription &&
        this.availablePlans[best].plan_id === this.currentSubscription.plan_id
      ) {
        return null;
      }

      return {
        name: this.availablePlans[best].name,
        betterThan: best ? this.availablePlans[best - 1].name : null,
        betterBy: best ? cost(best - 1) - cost(best) : null
      };
    }
  },
  methods: {
    ...mapActions(["setBillingAccess"]),
    format(date) {
      if (!date) {
        return;
      }
      if (typeof date === "string" || date instanceof String) {
        date = parseISO(date);
      }
      return format(date, "yyyy-MM-dd");
    },
    openChargebeePanel() {
      if (!this.chargebee) {
        return;
      }

      this.chargebee.createChargebeePortal().openSection(
        { sectionType: window.Chargebee.getPortalSections().PAYMENT_SOURCES },
        {
          close: () => {
            this.chargebee.logout();
            this.refreshData();
          }
        }
      );
    },
    openBudgetDialog(plan) {
      this.newPlan = plan;
      this.budgetMin = +plan.price;
      this.budget = this.budget
        ? Math.max(this.budget, +plan.price)
        : +plan.price + 60;

      if (
        this.currentSubscription &&
        this.currentSubscription.plan === plan.name &&
        this.currentSubscription.commission_cap
      ) {
        this.budget = +plan.price + +this.currentSubscription.commission_cap;
      }
      if (parseInt(this.newPlan.commission_percent)) {
        this.budgetDialogOpen = true;
      } else {
        this.selectPlan(plan);
      }
    },
    showError(msg) {
      this.$notify({
        title: this.$t("error saving"),
        message: this.$t(
          !msg ? "an unknown error occured, please try again later" : msg
        ),
        type: "error"
      });
    },
    async selectPlan(plan) {
      this.budgetDialogOpen = false;
      this.saving = true;
      let skip = false;
      try {
        if (!this.isShopify) {
          this.$alert(
            this.$t("would you like to switch to {plan} at {price}", {
              plan: plan.name,
              price: plan.price
            }),
            this.$t("activate subscription"),
            {
              showCancelButton: true,
              cancelButtonText: this.$t("cancel"),
              confirmButtonClass: "el-button--warning",
              confirmButtonText: this.$t("confirm")
            }
          ).catch(() => (skip = true));
        }
        if (skip) {
          return;
        }
        await selectPlan(
          plan.plan_id,
          +plan.commission_percent ? this.budget - plan.price : 0
        );
        const res = await getPageData("billing");
        this.currentSubscription = res.subscriptions.active;
        this.pendingSubscription = res.subscriptions.pending;
        if (!this.isShopify) {
          this.$notify({
            title: this.$t("success"),
            message: this.$t("plan updated"),
            type: "success"
          });
          return;
        }
        const timer = setTimeout(
          () => window.open(this.shopifyAppAdmin, "_blank"),
          3000
        );

        this.$alert(
          this.$t("you will be redirected to shopify admin panel"),
          this.$t("activate subscription"),
          {
            showCancelButton: true,
            cancelButtonText: this.$t("cancel"),
            confirmButtonClass: "el-button--warning",
            confirmButtonText: this.$t("open admin panel")
          }
        )
          .then(() => {
            clearTimeout(timer);
            window.open(this.shopifyAppAdmin, "_blank");
          })
          .catch(() => clearTimeout(timer));
      } catch (err) {
        this.showError();
      } finally {
        this.saving = false;
      }
    },
    refreshData() {
      this.loading = true;
      getPageData("billing")
        .then((res) => {
          try {
            this.paymentsConfigured = res.payments_configured;
            this.currentSubscription = res.subscriptions.active;
            this.setBillingAccess(res.subscriptions.active.products);
            this.pendingSubscription = res.subscriptions.pending;
          } catch (err) {
            Sentry.captureException(err);
          }
          this.availablePlans = res.available_plans
            .map((elem) => {
              let newelem = { ...elem };
              newelem.products = elem?.products?.personalization ?? {};
              return newelem;
            })
            .filter((plan) => !plan.annual)
            .sort((lhs, rhs) => lhs.price - rhs.price);
        })
        // get conversions from current billing period
        .then(() => {
          if (this.currentSubscription) {
            const periodStart = this.format(
              this.currentSubscription.current_period_start
            );
            const today = this.format(Date.now());

            return getPageData(
              `billing/conversions?startdate=${periodStart}&enddate=${today}`
            ).then((res) => {
              this.currentConversions = res.revenue;
            });
          }
        })
        // get conversions from last 30 dys for plan recommendation
        .then(() => {
          const monthAgo = this.format(subDays(Date.now(), 30));
          const today = this.format(Date.now());

          return getPageData(
            `billing/conversions?startdate=${monthAgo}&enddate=${today}`
          ).then((res) => {
            this.last30DaysConversions = res.revenue;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.$loadScript("https://js.chargebee.com/v2/chargebee.js").then(() => {
      this.chargebee = window.Chargebee.init({
        site: import.meta.env.VITE_APP_CHARGEBEE_DOMAIN
      });
      this.chargebee.setPortalSession(() => getPageData("billing/portal"));

      this.refreshData();
    });
  }
};
</script>

<style scoped>
.card-padding {
  padding: 0 5px;
}

.plan-name {
  font-size: 1.5em;
}

.plan-end {
  color: #80848e;
}

table {
  width: 100%;
  margin-bottom: 10px;
  font-size: 16px;
}

th,
td {
  padding: 5px;
  font-weight: normal;
}

td {
  text-align: right;
}

.conversions {
  color: #6fd08c;
}

.total th,
.total td {
  border-top: 1px solid #80848e;
}

.budget-form {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
}

.budget-disclaimer {
  margin: 1em 0;
  font-size: 14px;
  color: #80848e;
}
.alerts-row {
  margin-bottom: 10px;
}
</style>
