<template>
  <LoginLoading
    :msg="name ? `hello ${name}! we're logging you in` : 'Logging you in...'"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import LoginLoading from "./LoginLoading.vue";
export default defineComponent({
  name: "ShopifyLogin",
  components: {
    LoginLoading
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const name = computed(() => {
      const name = route?.params?.name ?? "";
      if (Array.isArray(name)) {
        return atob(name[0]);
      }
      return atob(name);
    });

    onMounted(async () => {
      try {
        const token = window.location.hash.replace(/^#/, "");
        if (!token) {
          await router.push({ name: "login-failed" });
          return;
        }
        await store.dispatch("shopifyLogin", token);
        if (!store.getters.isAuthenticated) {
          await router.push({ name: "login-failed" });
          return;
        }
        await router.push({ name: "overview" });
      } catch (err) {
        console.error(err);
        await router.push({
          name: "login-failed"
        });
      }
    });
    return {
      name
    };
  }
});
</script>
