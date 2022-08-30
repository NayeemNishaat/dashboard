<template>
  <div
    class="hidden md:block lg:w-[380px] xl:w-[550px] 2xl:w-[606px] max-w-full"
  >
    <ul class="flex">
      <li
        class="relative pr-6 lg:pr-8 xl:pr-14"
        :class="{ group: store.step === 1, group: store.step >= 1 }"
      >
        <div
          class="absolute left-5 top-4 h-[1px] w-full bg-brand-gray group-odd:bg-brand-yellow"
        ></div>
        <div class="flex flex-col gap-6 items-center relative">
          <div
            class="rounded-full ring-8 ring-white font-bold bg-white text-brand-gray group-odd:text-brand-gray-500 group-odd:bg-brand-yellow group-odd:border-brand-yellow w-8 h-8 flex justify-center items-center border-[2px] border-brand-gray"
          >
            1
          </div>
          <p class="text-xs font-bold text-center text-brand-gray uppercase">
            INTRO
          </p>
        </div>
      </li>
      <li
        class="relative pr-2 lg:pr-4 xl:pr-10"
        :class="{ group: store.step === 2, group: store.step >= 2 }"
      >
        <div
          class="absolute left-5 top-4 h-[1px] w-full bg-brand-gray group-even:bg-brand-yellow"
        ></div>
        <div class="flex flex-col gap-6 items-center relative">
          <div
            class="rounded-full ring-8 ring-white font-bold bg-white text-brand-gray group-even:text-brand-gray-500 group-even:bg-brand-yellow group-even:border-brand-yellow w-8 h-8 flex justify-center items-center border-[2px] border-brand-gray"
          >
            2
          </div>
          <p class="text-xs font-bold text-center text-brand-gray uppercase">
            HOME PAGE
          </p>
        </div>
      </li>
      <li
        class="relative pr-2 lg:pr-4 xl:pr-10"
        :class="{ group: store.step === 3, group: store.step >= 3 }"
      >
        <div
          class="absolute left-5 top-4 h-[1px] w-full bg-brand-gray group-odd:bg-brand-yellow"
        ></div>
        <div class="flex flex-col gap-6 items-center relative">
          <div
            class="rounded-full ring-8 ring-white font-bold bg-white text-brand-gray group-odd:text-brand-gray-500 group-odd:bg-brand-yellow group-odd:border-brand-yellow w-8 h-8 flex justify-center items-center border-[2px] border-brand-gray"
          >
            3
          </div>
          <p class="text-xs font-bold text-center text-brand-gray uppercase">
            Product PAGE
          </p>
        </div>
      </li>
      <li
        class="relative pr-6 lg:pr-8 xl:pr-14"
        :class="{ group: store.step === 4, group: store.step >= 4 }"
      >
        <div
          class="absolute left-5 top-4 h-[1px] w-full bg-brand-gray group-even:bg-brand-yellow"
        ></div>
        <div class="flex flex-col gap-6 items-center relative">
          <div
            class="rounded-full ring-8 ring-white font-bold bg-white text-brand-gray group-even:text-brand-gray-500 group-even:bg-brand-yellow group-even:border-brand-yellow w-8 h-8 flex justify-center items-center border-[2px] border-brand-gray"
          >
            4
          </div>
          <p class="text-xs font-bold text-center text-brand-gray uppercase">
            ANALYTICS
          </p>
        </div>
      </li>
      <li
        class="relative"
        :class="{ group: store.step === 5, group: store.step >= 5 }"
      >
        <div class="flex flex-col gap-6 items-center relative">
          <div
            class="rounded-full ring-8 ring-white font-bold bg-white text-brand-gray group-odd:text-brand-gray-500 group-odd:bg-brand-yellow group-odd:border-brand-yellow w-8 h-8 flex justify-center items-center border-[2px] border-brand-gray"
          >
            5
          </div>
          <p class="text-xs font-bold text-center text-brand-gray uppercase">
            BILLING
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BulletPoint",
  props: ["store"],
});
</script>

<style></style>
