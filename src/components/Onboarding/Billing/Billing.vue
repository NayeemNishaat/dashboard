<template>
  <div class="flex flex-col md:flex-row">
    <div
      class="md:w-[53%] 2xl:w-[50%] max-w-full flex items-center md:block flex-col relative bg-[#D5EFDA] rounded-[50px] md:rounded-none md:rounded-tr-[120px] lg:rounded-tr-[200px] ring-[14px] ring-inset ring-white px-6 sm:px-8 lg:!px-12 !pt-5 pb-36 md:!py-5"
    >
      <a href="#" class="inline-block xl:pl-20 !mt-5 md:mt-0">
        <figure>
          <img src="@/assets/img/logo.svg" alt="logo" />
        </figure>
      </a>
      <BillingLeft
        v-if="!planStore.loading"
        @ChangePlan="ChangePlan"
        :plans="planStore.plans"
        :plan="currentPlan"
      />
      <LoaderDots v-else />
    </div>
    <div
      class="px-8 pt-10 md:h-full pb-6 relative -mt-[6rem] md:mt-0 md:pl-3 lg:pl-5 xl:pl-5 md:w-[750px] max-w-full rounded-tl-[100px] md:rounded-none bg-white 2xl:pl-24 md:py-8 md:pr-6"
    >
      <Bullet :store="store" />
      <BillingRight v-if="!planStore.loading" :plan="currentPlan" />
      <Control
        @previous="previous"
        @next="next"
        :store="store"
        :nextLoading="planStore.finishing"
        :nextDisabled="!currentPlan.plan_id"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, PropType, onMounted, computed } from "vue";
import Control from "@/components/Onboarding/Control.vue";
import Bullet from "@/components/Onboarding/Bullet.vue";
import BillingLeft from "@/components/Onboarding/Billing/BillingLeft.vue";
import BillingRight from "@/components/Onboarding/Billing/BillingRight.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  selectPlan,
  GetBillingPlans,
  FinishOnboarding,
  postOnboardingNotification
} from "@/api/backend";
import { DisplayPlan, fillPlanDetails } from "./billing";
import LoaderDots from "@/components/LoaderDots.vue";
import { useStore } from "vuex";
import { OnboardingStore } from "../interfaces";

const props = defineProps({
  store: Object as PropType<OnboardingStore>
});
const emit = defineEmits(["previous", "next"]);
const { t } = useI18n({});
const planStore = reactive({
  plans: [] as Array<DisplayPlan>,
  loading: true,
  finishing: false
});
const router = useRouter();
const mainStore = useStore();
const finishOnboarding = async () => {
  await postOnboardingNotification({
    type: "onboarding_finish"
  });

  await FinishOnboarding();
  await mainStore.dispatch("getContext");
  if (hasFinishedOnboarding) {
    await router.push({ name: "setup-summary" });
  }
};
const ChangePlan = (plan_id) => {
  planStore.plans = planStore.plans.map((el) => {
    return {
      ...el,
      selected: el.plan_id == plan_id ? true : false
    };
  });
};
const currentPlan = computed(
  () =>
    planStore.plans.find((plan) => plan.selected === true) ||
    ({} as DisplayPlan)
);
const hasFinishedOnboarding = computed(
  () => mainStore.getters["onboarding/hasFinishedOnboarding"]
);
const previous = () => {
  emit("previous");
};
const next = async () => {
  planStore.finishing = true;
  await selectPlan(currentPlan.value.plan_id, 0);
  await finishOnboarding();
  planStore.finishing = false;
};
postOnboardingNotification({
  type: "billing_step"
});

onMounted(async () => {
  planStore.loading = true;
  const res = await GetBillingPlans();
  if (res?.subscriptions?.active?.active) {
    await finishOnboarding();
    planStore.loading = false;
    return;
  }

  planStore.plans = res.available_plans
    .filter((plan) => plan.active)
    .map((plan) => {
      let displayPlan: DisplayPlan = Object.assign(plan, {
        features: [] as Array<string>,
        selected: false
      });
      displayPlan = fillPlanDetails(displayPlan, t);
      return displayPlan;
    })
    .sort((lhs, rhs) => lhs.price - rhs.price);
  planStore.plans[0].selected = true;
  planStore.loading = false;
});
</script>

<style></style>
