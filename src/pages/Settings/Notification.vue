<template>
  <div>
    <upgrade-plan v-if="!notificationsAccess" feature="notifications" />
    <card v-else>
      <h3 slot="header">
        {{ $t("settings") }}
      </h3>
      <div v-if="saving">
        <span>{{ $t("saving") }}</span>
        <loader-dots></loader-dots>
      </div>
      <el-form label-position="top" label-width="100px" :model="notifications">
        <el-form-item :label="$t('position')">
          <el-radio-group
            v-model="notifications.position"
            :disabled="saving"
            @change="saveChanges()"
            fill="#e6a23c"
          >
            <el-radio-button label="top left">{{
              $t("top left")
            }}</el-radio-button>
            <el-radio-button label="top right">{{
              $t("top right")
            }}</el-radio-button>
            <el-radio-button label="bottom left">{{
              $t("bottom left")
            }}</el-radio-button>
            <el-radio-button label="bottom right">{{
              $t("bottom right")
            }}</el-radio-button>
            <el-radio-button label="custom">{{ $t("custom") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('color')">
          <el-color-picker
            v-model="notifications.color"
            @change="saveChanges()"
          ></el-color-picker>
        </el-form-item>
      </el-form>
    </card>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import { mapGetters, mapActions } from "vuex";

import Card from "@/components/Cards/Card.vue";
import LoaderDots from "@/components/LoaderDots.vue";
import UpgradePlan from "@/pages/Billing/UpgradePlan.vue";

export default {
  name: "Notifications",
  components: {
    Card,
    LoaderDots,
    UpgradePlan
  },

  data() {
    return {
      saving: false,
      settings: {},
      notifications: {
        position: "top left",
        color: "#f8ba00"
      }
    };
  },
  computed: {
    ...mapGetters(["client", "subscription"]),
    notificationsAccess() {
      if (!this.client?.apikey) {
        return {};
      }
      return this.subscription?.access?.personalization?.notifications;
    }
  },
  methods: {
    ...mapActions("settings", ["getSettings", "saveSettings"]),
    saveChanges() {
      this.saving = true;
      const newWebSettings = this.client.web_settings;
      newWebSettings.recommendations.notifications = this.notifications;
      this.saveSettings({ web_settings: newWebSettings })
        .catch((err) => {
          Sentry.captureException(err);
          this.$notify({
            title: this.$t("error saving"),
            message: this.$t(
              "an unknown error occured, please try again later"
            ),
            type: "warning"
          });
        })
        .finally(() => (this.saving = false));
    },
    async refreshData() {
      try {
        await this.getSettings();
      } finally {
        const notifications =
          this.client?.web_settings?.recommendations?.notifications;
        this.notifications = notifications || {
          position: "top left",
          color: "#f8ba00"
        };
      }
    }
  },
  created() {
    this.refreshData();
  }
};
</script>
