<template>
  <LoginLoading msg="Launching DataCue..." />
</template>
<script lang="ts">
import LoginLoading from "./LoginLoading.vue";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from ".";

export default defineComponent({
  setup() {
    const router = useRouter();

    onMounted(async () => {
      try {
        const auth = await getAuth();
        await auth.handleRedirectCallback();
        if (!router) {
          console.log("router unavailable!");
        }
        await router.push("summary");
      } catch (err) {
        console.log("callback error: ", err);
      }
    });
  },
  components: {
    LoginLoading
  }
});
</script>
