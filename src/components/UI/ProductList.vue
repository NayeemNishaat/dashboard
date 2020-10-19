<template>
  <div class="product-list row">
    <ProductListItem
      v-for="product in products"
      :key="product.product_id"
      :name="product.name"
      :photo_url="product.photo_url"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ProductListItem from "./ProductListItem.vue";
export default defineComponent({
  name: "Product List",
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ProductListItem
  }
});
</script>
