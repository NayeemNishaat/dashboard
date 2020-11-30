<template>
  <div class="centre-on-page" v-if="isShopify && !overrideShopify">
    <div class="logo-img">
      <img src="@/assets/img/datacue-logo-dark.svg" style="width:10rem" />
    </div>
    <div>
      <MessageBanner type="default">
        <div class="row">
          <div class="col-12">
            <h4>Login to DataCue from Shopify</h4>
            <p>
              To access DataCue, login to your Shopify admin panel and click on
              'DataCue' from the Apps section.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-flex">
            <dc-button type="primary" tag="a" :href="shopifyAdminLink"
              >Go to Shopify Admin</dc-button
            >
            <dc-button type="outline" @click="resetShopify"
              >I don't use Shopify</dc-button
            >
          </div>
        </div>
      </MessageBanner>
    </div>
  </div>
  <LoginLoading v-else msg="Logging you in..." />
</template>
<script lang="ts">
import LoginLoading from "./LoginLoading.vue";
import MessageBanner from "@/components/MessageBanner.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { authPlugin, getAuth } from ".";
import { useStore } from "vuex";

export default defineComponent({
  name: "Login",
  async setup() {
    console.log("in setup function");
    const store = useStore();
    const isShopify = store.getters.isShopify;
    const overrideShopify = ref(false);
    const shopifyAdminLink = computed(
      () => `https://${store.getters.apikey}/admin`
    );
    let auth: authPlugin | null = null;

    const resetShopify = () => {
      overrideShopify.value = true;
      if (!auth) {
        return;
      }
      auth.loginWithRedirect();
    };
    onMounted(() => {
      if (isShopify) {
        return;
      }
      if (!auth) {
        return;
      }
      auth.loginWithRedirect();
    });

    console.log("getting auth");
    auth = await getAuth();
    return {
      isShopify,
      shopifyAdminLink,
      overrideShopify,
      resetShopify
    };
  },
  components: {
    LoginLoading,
    MessageBanner
  }
});
</script>
<style lang="scss" scoped>
@import "../assets/sass/datacue/_colors.scss";
.dialog {
  max-width: 720px;
  padding: 1rem;
  border: 1px solid $gray-light;
}
</style>
