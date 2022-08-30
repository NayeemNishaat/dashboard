<template>
  <div class="md:border-t border-brand-gray">
    <div class="w-full flex justify-between !mt-3 md:!mt-5">
      <button
        v-if="store.step !== 1"
        type="button"
        @click="Previous"
        class="flex items-center gap-3"
      >
        <svg
          class="rotate-180"
          width="9"
          height="14"
          viewBox="0 0 9 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L7 7L1 13" stroke="black" stroke-width="2" />
        </svg>
        <span class="uppercase">Back </span>
      </button>
      <span v-else></span>
      <button
        type="button"
        @click="Next"
        class="uppercase w-[64px] h-[64px] md:w-auto md:h-auto px-6 !py-2.5 bg-brand-yellow text-black hover:bg-opacity-80 flex items-center justify-center gap-3 rounded-full"
      >
        <span class="hidden md:block uppercase" v-if="store.step === 1"
          >see my new homepage
        </span>
        <span class="hidden md:block uppercase" v-if="store.step === 2"
          >see my new product page</span
        >
        <span class="hidden md:block uppercase" v-if="store.step === 3"
          >How to measure results</span
        >
        <span class="hidden md:block uppercase" v-if="store.step === 4"
          >Select a pricing plan</span
        >
        <span class="hidden md:block uppercase" v-if="store.step === 5"
          >Active plane</span
        >
        <svg
          class="scale-110 md:scale-100"
          width="9"
          height="14"
          viewBox="0 0 9 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L7 7L1 13" stroke="black" stroke-width="2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ControlButtons",
  props: ["store"],
  setup(props, context) {
    const Previous = () => {
      context.emit("previous");
    };
    const Next = () => {
      context.emit("next");
    };
    return {
      Previous,
      Next,
    };
  },
});
</script>
