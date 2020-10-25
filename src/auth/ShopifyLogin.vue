<template>
  <LoginLoading msg="Logging you in..." />
</template>

<script lang="ts">
import { getApi } from "@/api";
import { defineComponent, onMounted, ref, Ref } from "vue";
import { getAuth } from ".";
import LoginLoading from "./LoginLoading.vue";
export default defineComponent({
  name: "ShopifyLogin",
  components: {
    LoginLoading
  },
  setup() {
    const error: Ref<null> | Ref<any> = ref(null);
    onMounted(async () => {
      try {
        const api = getApi();
        const auth = await getAuth();
        const res = await api.handleShopifyAuthentication();
        auth.logoutNoRedirect();
        await this.setAccessToken(res.data.token);
        await this.fetchClients();
        await this.setApikey(res.data.apikey);
        if (this.hasFinishedOnboarding) {
          this.$router.push({ name: "loading" });
        } else {
          this.$router.push({
            name: "onboarding",
            params: { platform: "shopify" }
          });
        }
      } catch (err) {
        Sentry.captureException(err);
        await this.$router.push({
          name: "login-failed"
        });
      }
    });
    return {
      error
    };
  }
});
</script>
