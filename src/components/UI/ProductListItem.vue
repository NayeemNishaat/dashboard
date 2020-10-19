<template>
  <div class="row product">
    <div class="col-3"><img class="product-photo" :src="photo_url" /></div>
    <div class="col-9 product-title">
      <span>{{ name }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Product List Item",
  props: {
    photo_url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    link: {
      type: String
    }
  }
});
</script>
