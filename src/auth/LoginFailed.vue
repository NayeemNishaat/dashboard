<template>
  <div class="centre-on-page">
    <div class="logo-img">
      <img src="@/assets/img/datacue-logo-dark.svg" style="width:10rem" />
    </div>
    <div class="error-msg">
      <error-msg
        msg="We're sorry, we couldn't log you in."
        description="This is most likely a temporary error. Please try again with another browser."
        :refresh-btn="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginLoading from "./LoginLoading.vue";
export default defineComponent({
  name: "Login"
});
</script>
<style scoped>
.error-msg {
  width: 80%;
  max-width: 720px;
}
</style>
