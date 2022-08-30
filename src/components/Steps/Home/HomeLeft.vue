<template>
  <div
    class="md:h-[calc(100%-80px)] realive w-full flex justify-center items-center sm:!px-20 md:px-0 !pt-5 pb-32 md:pt-0 md:pb-0 xl:pl-4 xl:pr-20">
    <swiper ref="mySwiper" :modules="modules" :slides-per-view="1" :space-between="50" :navigation="{
      nextEl: `.swiper-next`,
      prevEl: `.swiper-prev`,
    }" :pagination="{ clickable: true }" @swiper="onSwiper" @slideChange="slideChange">
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-two-img-1.png" alt="step-two-img-1.png" />
        </figure>
      </swiper-slide>
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-two-img-2.png" alt="step-two-img-1.png" />
        </figure>
      </swiper-slide>
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-two-img-3.png" alt="step-two-img-1.png" />
        </figure>
      </swiper-slide>
    </swiper>
    <NavigationSwiper class="w-[74%] lg:w-[76%] xl:w-[68%] 2xl:w-[71%]" :class="
      index === 2
        ? 'left-[17%] lg:left-[16%] xl:left-[15%]'
        : 'left-[15%] lg:left-[14%] xl:left-[12%]'
    " />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import NavigationSwiper from "../Swiper/NavigationSwiper.vue";

export default defineComponent({
  name: "HomeLeft",
  components: {
    Swiper,
    SwiperSlide,
    NavigationSwiper,
  },
  setup(props, context) {
    const index = ref(0);
    const onSwiper = (swiper) => {
      return swiper.activeIndex;
    };
    const slideChange = (onSwiper) => {
      index.value = onSwiper.activeIndex;
      context.emit("getIndex", onSwiper.activeIndex);
    };
    return {
      onSwiper,
      slideChange,
      index,
      modules: [Navigation, Pagination],
    };
  },
});
</script>
