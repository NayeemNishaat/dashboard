<template>
  <div
    class="hidden md:flex justify-between items-center absolute max-w-full mx-auto z-30 top-[55%] translate-y-[-50%]"
  >
    <button
      type="button"
      class="swiper-prev w-[24px] h-[24px] lg:w-[50px] lg:h-[50px] xl:w-[62px] xl:h-[62px] rounded-full flex justify-center items-center bg-brand-yellow hover:bg-opacity-80"
    >
      <svg
        class="w-[15px] h-[15px] lg:w-[32px] lg:h-[32px]"
        viewBox="0 0 33 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 26.667L18.38 24.787L10.94 17.3337L27.1666 17.3337L27.1666 14.667L10.94 14.667L18.38 7.21366L16.5 5.33366L5.83329 16.0003L16.5 26.667Z"
          fill="black"
        />
      </svg>
    </button>
    <button
      type="button"
      class="swiper-next w-[24px] h-[24px] lg:w-[50px] lg:h-[50px] xl:w-[62px] xl:h-[62px] rounded-full flex justify-center items-center bg-brand-yellow hover:bg-opacity-80"
    >
      <svg
        class="w-[15px] h-[15px] lg:w-[32px] lg:h-[32px]"
        viewBox="0 0 33 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 5.33301L14.62 7.21301L22.06 14.6663H5.83337V17.333H22.06L14.62 24.7863L16.5 26.6663L27.1667 15.9997L16.5 5.33301Z"
          fill="black"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavigationSwiper",
  props: ["swiperIndex"],
});
</script>
