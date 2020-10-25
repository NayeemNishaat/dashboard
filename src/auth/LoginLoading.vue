<template>
  <div class="centre-on-page">
    <div class="logo-img">
      <img src="@/assets/img/datacue-logo-dark.svg" style="width:10rem" />
    </div>
    <h3>{{ msg }}</h3>
    <loading type="yellow-circle" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    msg: {
      type: String,
      default: "Loading..."
    }
  }
});
</script>
