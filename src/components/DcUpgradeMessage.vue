<template>
  <dc-message-banner icon="ti-lock" type="error">
    <div>
      {{ message }}
      <router-link to="/billing">{{
        $t("setupSummary:NoPlanSelected:btn")
      }}</router-link>
    </div>
  </dc-message-banner>
</template>
<script>
import DcMessageBanner from "/src/components/DcMessageBanner.vue";
export default {
  name: "UpgradeMessage",
  components: {
    DcMessageBanner
  },
  props: {
    message: {
      type: String
    }
  }
};
</script>
<style scoped>
.message-banner-panel {
  align-items: center;
}
</style>
