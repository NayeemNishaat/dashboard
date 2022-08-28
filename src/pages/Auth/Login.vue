<template>
  <div class="loginpage">
    <card-message-box>
      <h2>{{ $t("Login required") }}</h2>
      <h4>Shopify users</h4>
      <p>
        Login to DataCue from your Shopify admin panel. Simply, click on
        'DataCue' in the Apps section after you login to Shopify.
      </p>
      <h4>Other Platforms</h4>
      <p>
        Please click the button below to login with your email and password.
      </p>
      <dc-button type="primary" @click="auth0Login">{{
        $t("login")
      }}</dc-button>
    </card-message-box>
  </div>
</template>

<script>
import { login } from "@/api/AuthService.ts";
import { mapGetters } from "vuex";
import DcButton from "@/components/DcButton.vue";
import CardMessageBox from "@/components/Cards/CardMessageBox.vue";
export default {
  name: "login",
  components: {
    DcButton,
    CardMessageBox,
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
