<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <div class="copyright d-flex flex-wrap">
        <span>Made with&nbsp;</span>
        <i class="ti-heart"></i>
        <span>&nbsp;in Singapore</span>
      </div>
      <div class="copyright d-flex flex-wrap">
        <span>&copy; {{ new Date().getFullYear() }} DataCue (PTE. LTD.)</span>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
<style></style>
