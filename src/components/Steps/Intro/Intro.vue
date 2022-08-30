<template>
  <div class="flex flex-col md:flex-row">
    <div
      class="md:w-[50%] max-w-full flex items-center md:block flex-col md:shrink-0 xl:shrink relative bg-brand-gray-50 rounded-[50px] md:rounded-tr-[120px] md:rounded-none lg:rounded-tr-[200px] ring-[14px] ring-inset ring-white px-8 lg:!px-12 !py-5">
      <a href="#" class="inline-block xl:pl-20 !mt-5 md:mt-0">
        <figure>
          <img src="@/assets/img/logo.svg" alt="logo" />
        </figure>
      </a>
      <IntroLeft />
    </div>
    <div
      class="px-8 pt-7 pb-6 relative -!mt-24 md:mt-0 md:pl-3 lg:pl-5 xl:pl-10 md:w-[750px] max-w-full rounded-tl-[100px] md:rounded-none bg-white 2xl:pl-24 md:py-8 md:pr-6">
      <Bullet :store="store" />
      <IntroRight />
      <Control @previous="previous" @next="next" :store="store" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Control from "@/components/Steps/Control.vue";
import Bullet from "@/components/Steps/Bullet.vue";
import IntroLeft from "@/components/Steps/Intro/IntroLeft.vue";
import IntroRight from "@/components/Steps/Intro/IntroRight.vue";

export default defineComponent({
  name: "IntroMain",
  props: ["store"],
  emits: ["previous", "next"],
  components: {
    IntroLeft,
    IntroRight,
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
