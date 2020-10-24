<template>
  <div class="centre-on-page">
    <loading type="circle" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { getAuth } from ".";

export default defineComponent({
  name: "Login",
  setup() {
    onMounted(async () => {
      const auth = await getAuth();
      auth.loginWithRedirect();
    });
  }
});
</script>
