<template>
  <div class="loginpage">
    <loader-dots></loader-dots>
  </div>
</template>

<script>
import LoaderDots from "@/components/LoaderDots.vue";

import * as Sentry from "@sentry/browser";
import { handleAuthentication } from "@/api/AuthService";
import { mapActions } from "vuex";

export default {
  name: "callback",
  components: {
    LoaderDots
  },
  methods: {
    ...mapActions(["getContext", "setAccessToken"])
  },
  mounted() {
    handleAuthentication((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setAccessToken({
          token: authResult.idToken,
          auth_provider: "auth0"
        })
          .then(() => {
            this.getContext()
              .then(() => {
                this.$router.push({ name: "loading" });
              })
              .catch((err) => {
                Sentry.captureException(err);
              });
          })
          .catch((err) => {
            Sentry.captureException(err);
          });
      } else if (err) {
        this.$router.push({ name: "login" });
        Sentry.captureException(err);
      }
    });
  }
};
</script>
