<template>
  <div class="centre-on-page" v-if="isShopify && !overrideShopify">
    <div class="logo-img">
      <img src="@/assets/img/datacue-logo-dark.svg" style="width: 10rem" />
    </div>
    <div>
      <dc-message-banner>
        <div class="row">
          <div class="col-12">
            <h4>Your session has expired</h4>
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
              >Login with email</dc-button
            >
          </div>
        </div>
      </dc-message-banner>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/AuthService";
import { mapGetters } from "vuex";
import DcButton from "@/components/DcButton.vue";
import CardMessageBox from "@/components/Cards/CardMessageBox.vue";
import DcMessageBanner from "@/components/DcMessageBanner.vue";
export default {
  name: "login",
  components: {
    DcButton,
    CardMessageBox,
    DcMessageBanner,
  },
  computed: {
    ...mapGetters(["languageCode", "client"]),
  },
  methods: {
    auth0Login() {
      login(this.languageCode || "en", this.client.type, "personalization");
    },
  },
};
</script>

<style>
.loginpage {
  height: 100vh;
  width: 100vw;
  background-color: #f4f3ef;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
