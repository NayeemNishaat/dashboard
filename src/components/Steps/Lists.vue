<template>
  <li class="flex gap-3 items-start">
    <div
      class="shrink-0 !mt-2 w-[14px] h-[14px] rounded-full bg-brand-yellow"
    ></div>
    <div class="space-y-3.5">
      <h2 class="text-xl lg:text-2xl leading-[1] font-bold text-black">
        {{ title }}
      </h2>
      <p class="text-base lg:text-xl text-brand-gray-500 md:pr-10 xl:pr-24">
        {{ text }}
      </p>
    </div>
  </li>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ListItems",
  props: ["title", "text"],
});
</script>
