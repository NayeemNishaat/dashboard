<template>
  <div
    class="md:h-[calc(100%-165px)] xl:h-[calc(100%-150px)] flex justify-center items-center"
  >
    <div class="w-full space-y-6 !py-5">
      <h2
        class="text-black text-[22px] xl:text-[40px] 2xl:text-[48px] leading-[1.3] font-bold"
      >
        Start for free, no hidden fees. Plans that match your store needs
      </h2>
      <div class="relative pb-5 xl:hidden">
        <DataMenus :plan="plan" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataMenus from "@/components/Steps/DataMenus.vue";
export default defineComponent({
  components: { DataMenus },
  name: "BillingRight",
  props: ["plan"],
});
</script>
