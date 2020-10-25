<template>
  <LoginLoading msg="Logging you in..." />
</template>
<script lang="ts">
import LoginLoading from "./LoginLoading.vue";
import { defineComponent, onMounted } from "vue";
import { getAuth } from ".";

export default defineComponent({
  name: "Login",
  setup() {
    onMounted(async () => {
      const auth = await getAuth();
      auth.loginWithRedirect();
    });
  },
  components: {
    LoginLoading
  }
});
</script>
