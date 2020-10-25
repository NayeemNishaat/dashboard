<template>
  <LoginLoading msg="Launching DataCue..." />
</template>
<script lang="ts">
import LoginLoading from "./LoginLoading.vue";
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Loading",
  setup() {
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      try {
        if (!store.getters.isAuthenticated) {
          await store.dispatch("fetchClients");
          const nextPage = store.getters.nextPage || "summary";
          await router.push(nextPage);
        }
      } catch (e) {
        console.log(e);
      }
    });
  },
  components: {
    LoginLoading
  }
});
</script>
