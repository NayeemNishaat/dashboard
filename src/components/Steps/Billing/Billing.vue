<template>
  <div class="flex flex-col md:flex-row">
    <div
      class="md:w-[53%] 2xl:w-[50%] max-w-full flex items-center md:block flex-col relative bg-[#D5EFDA] rounded-[50px] md:rounded-none md:rounded-tr-[120px] lg:rounded-tr-[200px] ring-[14px] ring-inset ring-white px-6 sm:px-8 lg:!px-12 !pt-5 pb-36 md:!py-5">
      <a href="#" class="inline-block xl:pl-20 !mt-5 md:mt-0">
        <figure>
          <img src="@/assets/img/logo.svg" alt="logo" />
        </figure>
      </a>
      <BillingLeft @ChangePlan="ChangePlan" :plans="datas.plans" :plan="datas.plan" />
    </div>
    <div
      class="px-8 pt-10 md:h-full pb-6 relative -mt-[6rem] md:mt-0 md:pl-3 lg:pl-5 xl:pl-5 md:w-[750px] max-w-full rounded-tl-[100px] md:rounded-none bg-white 2xl:pl-24 md:py-8 md:pr-6">
      <Bullet :store="store" />
      <BillingRight :plan="datas.plan" />
      <Control @previous="previous" @next="next" :store="store" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import Control from "@/components/Steps/Control.vue";
import Bullet from "@/components/Steps/Bullet.vue";
import BillingLeft from "@/components/Steps/Billing/BillingLeft.vue";
import BillingRight from "@/components/Steps/Billing/BillingRight.vue";

export default defineComponent({
  name: "BillingMain",
  props: ["store"],
  emits: ["previous", "next"],
  components: {
    BillingLeft,
    BillingRight,
    Control,
    Bullet,
  },
  setup(props, context) {
    const datas = reactive({
      plans: [
        {
          id: 1,
          name: "Basics",
          trial_period_days: 14,
          price_per_month: 9.99,
          price_per_year: 110,
          description:
            "Basic homepage with personalized banners for new business",
          features: [
            "5 dynamic banners",
            "1 banner layout",
            "Recently viewed products",
            "Google Analytics support",
            "Chat + Email support",
          ],
          active: true,
        },
        {
          id: 2,
          name: "Essentials",
          trial_period_days: 14,
          price_per_month: 29.99,
          price_per_year: 110,
          description:
            "Must-have homepage features for a personalized visitor experience",
          features: [
            "15 dynamic banners",
            "3 banner layouts",
            "Personalized products for each visitor",
            "Frequently bought together (cross-sell)",
            "Similar products (up-sell)",
          ],
          active: false,
        },
        {
          id: 3,
          name: "Standard",
          trial_period_days: 14,
          price_per_month: 99.99,
          price_per_year: 110,
          description:
            "Complete personalized homepage for businesses looking to grow sales",
          features: [
            "40 dynamic banners",
            "Personalized categories for each visitor",
            "Category top products",
          ],
          active: false,
        },
        {
          id: 4,
          name: "Premium",
          trial_period_days: 14,
          price_per_month: 299.99,
          price_per_year: 110,
          description:
            "Premium personalized homepage for brands that need a unique design",
          features: [
            "100 dynamic banners",
            "Custom designed banner layouts",
            "Web Notifications",
            "A/B testing (coming soon)",
          ],
          active: false,
        },
      ],
      plan: {},
    });
    const filterData = () => {
      const data = datas.plans.find((el) => el.active === true);
      datas.plan = data as object;
    };
    const ChangePlan = (id) => {
      const data = datas.plans.find((el) => el.id === id);
      datas.plan = data as object;

      datas.plans = datas.plans.map((el) => {
        return {
          ...el,
          active: el.id == id ? true : false,
        };
      });
    };
    const previous = () => {
      context.emit("previous");
    };
    const next = () => {
      console.log("Billing step");
    };
    onMounted(() => {
      filterData();
    });
    return {
      datas,
      ChangePlan,
      previous,
      next,
    };
  },
});
</script>

<style>
</style>
