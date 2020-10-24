<template>
  <div class="centre-on-page">
    <loading type="circle" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from ".";

export default defineComponent({
  setup() {
    const router = useRouter();
    onMounted(async () => {
      const auth = await getAuth();
      await auth.handleRedirectCallback();
      if (!router) {
        console.log("router unavailable!");
      }
      router.push("summary");
    });
  }
});
</script>
