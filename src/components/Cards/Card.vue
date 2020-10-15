<template>
  <div class="card">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-category" v-if="subTitle">{{ subTitle }}</p>
      </slot>
    </div>
    <div class="card-body" v-if="$slots.default">
      <slot></slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" v-if="$slots.footer">
      <hr />
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "card",
  props: {
    title: String,
    subTitle: String
  }
});
</script>
<style></style>
