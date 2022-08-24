<template>
  <div class="loginpage">
    <loader-dots></loader-dots>
  </div>
</template>

<script>
import * as Sentry from "@sentry/browser";
import LoaderDots from "/src/components/LoaderDots.vue";

export default {
  name: "NotFound",
  components: {
    LoaderDots
  },
  mounted() {
    Sentry.captureMessage(
      `Page not found error, navigating to: ${this.$route.fullPath}`,
      Sentry.Severity.Error
    );
    this.$router.push({ name: "summary" });
  }
};
</script>
