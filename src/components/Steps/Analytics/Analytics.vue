<template>
  <div class="flex flex-col md:flex-row">
    <div
      class="md:w-[50%] max-w-full flex items-center md:block flex-col md:shrink-0 xl:shrink relative bg-brand-gray-50 rounded-[50px] md:rounded-tr-[120px] md:rounded-none lg:rounded-tr-[200px] ring-[14px] ring-inset ring-white px-8 lg:!px-12 !py-5">
      <a href="#" class="inline-block xl:pl-20 !mt-5 md:mt-0">
        <figure>
          <img src="@/assets/img/logo.svg" alt="logo" />
        </figure>
      </a>
      <AnalyticsLeft />
    </div>
    <div
      class="px-8 pt-7 pb-6 relative -!mt-24 md:mt-0 md:pl-3 lg:pl-5 xl:pl-10 md:w-[750px] max-w-full rounded-tl-[100px] md:rounded-none bg-white 2xl:pl-24 md:py-8 md:pr-6">
      <Bullet :store="store" />
      <AnalyticsRight class="!px-2" />
      <Control @previous="previous" @next="next" :store="store" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Control from "@/components/Steps/Control.vue";
import Bullet from "@/components/Steps/Bullet.vue";
import AnalyticsLeft from "@/components/Steps/Analytics/AnalyticsLeft.vue";
import AnalyticsRight from "@/components/Steps/Analytics/AnalyticsRight.vue";

export default defineComponent({
  name: "AnalyticsMain",
  props: ["store"],
  emits: ["previous", "next"],
  components: {
    AnalyticsLeft,
    AnalyticsRight,
    Control,
    Bullet,
  },
  setup(props, context) {
    const previous = () => {
      context.emit("previous");
    };
    const next = () => {
      context.emit("next");
    };
    return {
      previous,
      next,
    };
  },
});
</script>

<style>
</style>
