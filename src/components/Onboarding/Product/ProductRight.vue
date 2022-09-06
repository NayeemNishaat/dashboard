<template>
  <div
    class="md:h-[calc(100%-150px)] lg:h-[calc(100%-180px)] flex justify-center lg:pt-10 lg:mt-8"
  >
    <div class="w-full space-y-6 !py-5">
      <h2 class="text-black text-[22px] xl:text-[48px] leading-[1.3] font-bold">
        Increase order value and conversion rate with product recommendations
      </h2>
      <div class="relative pb-5">
        <ul class="flex gap-12 flex-col" v-if="index === 0">
          <Lists
            title="Cross sells"
            text="Shows products that other customers bought with the current product. Increases average order value"
          />
        </ul>
        <ul class="flex gap-12 flex-col" v-if="index === 1">
          <Lists
            title="Similar products"
            text="Show more products similar to the current product. Increases add to cart events on your product page"
          />
        </ul>
        <ul class="flex gap-12 flex-col" v-if="index === 2">
          <Lists
            title="Recently viewed "
            text="Help your visitors resume their shopping by showing the products they last viewed"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Lists from "../Lists.vue";
export default defineComponent({
  components: { Lists },
  name: "ProductRight",
  props: ["index"],
});
</script>
