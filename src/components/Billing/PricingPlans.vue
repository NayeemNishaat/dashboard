<template>
  <div>
    <h3 class="plans-header">{{ $t("our plans") }}</h3>
    <div class="container">
      <div class="row pricing-plans">
        <div
          v-for="plan in availablePlans"
          :key="plan.plan_id"
          :class="
            12 % availablePlans.length === 0
              ? `col-lg-${12 / availablePlans.length}`
              : 'col-lg-4'
          "
          class="d-flex pricing-col"
        >
          <pricing-card
            :title="plan.name"
            :selected="currentPlanName === plan.name"
          >
            <div class="card-padding">
              <p v-if="plan.name === 'All Features'" class="plan-price">
                {{ +plan.commission_percent }}%
              </p>
              <p v-else class="plan-price">${{ +plan.price }}</p>
              <p>{{ $t("banners", 2) }}</p>
              <ul class="plan-product-list">
                <li>
                  {{
                    $t(`n dynamic banners`, {
                      count: plan.products.banners.banner_limit
                    })
                  }}
                </li>
                <li>
                  {{
                    $t(`n banner layouts`, {
                      count: plan.products.banners.allowed_layouts.length
                    })
                  }}
                </li>
                <li v-if="plan.products.banners.custom_layout">
                  {{ $t(`custom banner layout`) }}
                </li>
              </ul>
              <p>{{ $t("products", 2) }}</p>
              <ul class="plan-product-list">
                <li
                  v-for="(productType, idx) in [
                    'recent',
                    'user_related',
                    'related',
                    'top',
                    'user_related_categories',
                    'similar'
                  ].filter((elem) => plan.products.products[elem])"
                  :key="idx"
                >
                  {{ $t(productType) }}
                </li>
              </ul>
              <p v-if="+plan.commission_threshold">
                {{
                  $t("{amount} minimum spend", {
                    amount: +(
                      (+plan.commission_percent / 100) *
                      +plan.commission_threshold
                    )
                  })
                }}
              </p>
            </div>
            <div slot="footer">
              <dc-button
                :disabled="
                  disablePlanSelection || currentPlanId === plan.plan_id
                "
                type="primary"
                @click="selectPlan(plan)"
              >
                {{
                  $t(
                    currentPlanId === plan.plan_id
                      ? "current plan"
                      : currentPlanId === plan.plan_id &&
                        parseInt(plan.commission_percent) > 0
                      ? "change budget"
                      : "choose plan"
                  )
                }}
              </dc-button>
            </div>
          </pricing-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PricingCard from "@/components/Cards/PricingCard.vue";
import DcButton from "@/components/DcButton.vue";

export default {
  name: "PricingPlans",
  components: {
    PricingCard,
    DcButton
  },
  computed: {
    currentPlanName() {
      return this.currentPlan && this.currentPlan.name;
    },
    currentPlanId() {
      return this.currentPlan && this.currentPlan.plan_id;
    }
  },
  methods: {
    selectPlan(plan) {
      this.$emit("selectplan", plan);
    }
  },
  props: {
    availablePlans: {
      type: Array,
      default: () => []
    },
    disablePlanSelection: {
      type: Boolean,
      default: false
    },
    currentPlan: {
      type: Object
    }
  }
};
</script>
<style scoped>
.row.pricing-plans {
  padding-left: 15px;
  padding-right: 15px;
}

.card.pricing {
  flex: 1;
}

.pricing-col.d-flex {
  margin: 0px;
}

.plan-product-list {
  padding-left: 1em;
}

.plan-product-list li {
  list-style: none;
  padding-left: 2em;
  background: url("@/assets/img/tick.svg") center left / 1em 1em no-repeat;
}

.plan-price {
  font-family: "Bariol", sans-serif;
  font-size: 3em;
  text-align: center;
}

.plans-header {
  text-align: center;
}
</style>
