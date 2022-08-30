<template>
  <div>
    <loader-dots v-if="loading"></loader-dots>
    <div v-else>
      <h3>{{ $t("select a website to manage") }}</h3>
      <el-table
        ref="singleTable"
        data-id="loading:select-website-table"
        :data="Object.values({})"
        highlight-current-row
        @current-change="handleClientChange"
        style="width: 100%"
        class="website-picker"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          property="domain"
          :label="$t('domain')"
        ></el-table-column>
        <el-table-column property="name" :label="$t('name')"></el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <dc-button
          data-id="loading:select-website-btn"
          :disabled="!selectedApikey"
          type="primary"
          @click="selectClient()"
        >
          {{ $t("select") }}</dc-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";
import LoaderDots from "@/components/LoaderDots.vue";
import DcButton from "@/components/DcButton.vue";
export default {
  name: "Loading",
  components: {
    DcButton,
    LoaderDots
  },
  data() {
    return {
      selectedClient: null,
      selectedApikey: null
    };
  },
  methods: {
    ...mapActions(["getContext"]),
    ...mapActions("onboarding", ["finishSetup", "fetchSetupSummary"]),
    handleClientChange(val) {
      // if (!val) {
      //   return;
      // }
      // this.selectedClient = val;
      // this.selectedApikey = this.selectedClient.apikey;
    },
    async setClient() {
      // try {
      //   await this.setApikey(this.selectedApikey);
      //   Sentry.setUser({
      //     id: this.apikey,
      //     email: this.user.email,
      //   });
      //   this.$Tawk.$updateChatUser(this.user);
      //   await this.$router.push(this.nextRoute);
      // } catch (err) {
      //   Sentry.captureException(err);
      // }
    },
    async checkOnboardingStatus() {
      const profile = this.profile;
      try {
        this.$Tawk.$updateChatUser(this.user, this.context?.token);
      } catch (err) {
        Sentry.captureException(err);
      }
      if (profile) {
        try {
          if (profile.has_finished_setup) {
            await this.$router.push(this.nextRoute || { name: "summary" });
            return;
          }
          await this.fetchSetupSummary();
          if (this.hasFinishedSetup) {
            this.finishSetup();
            if (this.nextRoute?.name ?? "" === "setup-summary") {
              await this.$router.push({ name: "summary" });
              return;
            }
            await this.$router.push(this.nextRoute || { name: "summary" });
            return;
          }
          this.$router.push(this.nextPage || { name: "setup-summary" });
        } catch (err) {
          console.error(err);
          Sentry.captureException(err);
        }
      }
    }
  },
  computed: {
    ...mapGetters(["client", "nextPage", "user", "context"]),
    ...mapGetters("settings", ["profile"]),
    ...mapGetters("onboarding", ["hasFinishedSetup"]),
    nextRoute() {
      return this.nextPage || { name: "summary" };
    },
    loading() {
      return !this.client?.apikey;
    }
  },
  async mounted() {
    if (this.context?.client?.apikey) {
      await this.checkOnboardingStatus();
      return;
    }
    //first time launch, get it from the backend
    try {
      await this.getContext();
      if (this.context?.client?.apikey) {
        await this.checkOnboardingStatus();
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
    }
  }
};
</script>
<style scoped>
.website-picker {
  cursor: pointer;
  text-align: left;
}
</style>
