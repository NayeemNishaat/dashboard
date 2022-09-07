<template>
  <div class="md:h-[calc(100%-150px)] lg:h-[calc(100%-180px)] flex justify-center lg:pt-10 lg:mt-8">
    <div class="w-full space-y-6 !py-5">
      <h2 class="text-black text-[22px] xl:text-[48px] leading-[1.3] font-bold">
        Reduce bounce rate by showing a personalized homepage to each visitor
      </h2>
      <div class="relative pb-5">
        <ul class="flex gap-12 flex-col" v-if="index === 0">
          <Lists title="Notifications"
            text="Let customers know when products they like are back in stock, on discount or low in stock" />
          <Lists title="Dynamic banners"
            text="We’ll show the most relevant banner images to get each visitors attention" />
        </ul>
        <ul class="flex gap-12 flex-col" v-if="index === 1">
          <Lists title="Dynamic categories"
            text="Show the top product categories that best match the visitor.You can show multiple categories" />
          <Lists title="Personalized products"
            text="List of products that the customer is most likely to purchase based on their browsing history and purchases" />
        </ul>
        <ul class="flex gap-12 flex-col" v-if="index === 2">
          <Lists title="Recently viewed"
            text="Help your visitors resume their shopping by showing the products they last viewed" />
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
  name: "HomeRight",
  props: ["index"],
});
</script>
