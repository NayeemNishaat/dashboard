<template>
  <div class="flex flex-col md:flex-row">
    <div
      class="md:w-[50%] max-w-full flex items-center md:block flex-col relative bg-[#FFECC7] rounded-[50px] md:rounded-none md:rounded-tr-[120px] lg:rounded-tr-[200px] ring-[14px] ring-inset ring-white px-6 sm:px-8 lg:!px-12 !py-5">
      <a href="#" class="inline-block xl:pl-20 !mt-5 md:mt-0">
        <figure>
          <img src="@/assets/img/logo.svg" alt="logo" />
        </figure>
      </a>
      <HomeLeft @getIndex="getIndex" />
    </div>
    <div
      class="px-8 pt-10 md:h-full pb-6 relative -mt-[12rem] md:mt-0 md:pl-3 lg:pl-5 xl:pl-10 md:w-[750px] max-w-full rounded-tl-[100px] md:rounded-none bg-white 2xl:pl-24 md:py-8 md:pr-6">
      <Bullet :store="store" />
      <HomeRight class="!px-2" :index="swiper.activeIndex" />
      <Control @previous="previous" @next="next" :store="store" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Control from "@/components/Onboarding/Control.vue";
import Bullet from "@/components/Onboarding/Bullet.vue";
import HomeLeft from "@/components/Onboarding/Home/HomeLeft.vue";
import HomeRight from "@/components/Onboarding/Home/HomeRight.vue";

export default defineComponent({
  name: "HomeMain",
  props: ["store"],
  emits: ["previous", "next"],
  components: {
    HomeLeft,
    HomeRight,
    Control,
    Bullet,
  },
  setup(props, context) {
    const swiper = reactive({
      activeIndex: 0,
    });
    const getIndex = (index) => {
      swiper.activeIndex = index;
    };
    const previous = () => {
      context.emit("previous");
    };
    const next = () => {
      context.emit("next");
    };
    return {
      swiper,
      getIndex,
      previous,
      next,
    };
  },
});
</script>

<style>
</style>
