<template>
  <div
    class="md:h-[calc(100%-110px)] realive w-full flex justify-center items-center sm:!px-20 md:!px-4 !pt-5 pb-32 md:pt-0 md:pb-0 lg:!px-14 xl:!px-20 2xl:!px-28">
    <swiper ref="mySwiper" :modules="modules" :slides-per-view="1" :space-between="50" :navigation="{
      nextEl: `.swiper-next`,
      prevEl: `.swiper-prev`,
    }" :pagination="{ clickable: true }" @swiper="onSwiper" @slideChange="slideChange">
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-three-img-1.png" alt="step-three-img-1.png" />
        </figure>
      </swiper-slide>
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-three-img-1.png" alt="step-three-img-1.png" />
        </figure>
      </swiper-slide>
      <swiper-slide class="pb-20 sm:!py-10">
        <figure>
          <img class="w-full" src="@/assets/img/onboarding/step-three-img-1.png" alt="step-three-img-1.png" />
        </figure>
      </swiper-slide>
    </swiper>
    <NavigationSwiper
      class="w-[74%] lg:w-[68%] xl:w-[67%] 2xl:w-[65%] left-[15%] lg:left-[17.5%] xl:left-[18%] 2xl:left-[19%]" />
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
  name: "ProductLeft",
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
