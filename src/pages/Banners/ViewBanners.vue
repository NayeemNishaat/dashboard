<template>
  <div>
    <div class="row">
      <div class="col-6">
        <div class="row d-flex">
          <router-link to="/banners/add">
            <dc-button type="primary" data-id="feature_page:add-banner-btn" :disabled="tooManyBanners">
              <i class="ti-plus"></i>
              &nbsp;&nbsp;{{ $t("add banner") }}
            </dc-button>
          </router-link>
        </div>
      </div>
      <div class="col-6">
        <date-range-picker @datechange="refreshData"></date-range-picker>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <dc-upgrade-message v-if="tooManyBanners" :message="
          $t('reached plan limit of n banners. upgrade to add more.', {
            count: bannerLimit
          })
        " />
        <card-message-box v-if="!installationSettings.banners" type="error">
          <slot>{{ $t("banners not installed") }}</slot>
          <template v-slot:action>
            <dc-button tag="a" type="outline" :href="addBannersLink">{{
                $t("add banners widget")
            }}</dc-button>
          </template>
        </card-message-box>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <el-tabs v-model="selectedBannerType">
          <el-tab-pane :label="$t(getBannerLabel('main'))" name="main"></el-tab-pane>
          <el-tab-pane :label="$t(getBannerLabel('sub'))" name="sub"></el-tab-pane>
        </el-tabs>
        <card-grid :loading="loading" :cards="selBanners" @delete="delBanner" @edit="editBanner" card-type="banners">
        </card-grid>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import * as Sentry from "@sentry/browser";
import CardGrid from "@/components/Cards/CardGrid.vue";
import CardMessageBox from "@/components/Cards/CardMessageBox.vue";
import DcButton from "@/components/DcButton.vue";
import DateRangePicker from "@/components/DateRangePicker.vue";
import DcUpgradeMessage from "@/components/DcUpgradeMessage.vue";

import { getPageData, deleteBanner } from "@/api/backend";

export default {
  name: "ViewBanners",
  components: {
    CardGrid,
    CardMessageBox,
    DcButton,
    DateRangePicker,
    DcUpgradeMessage
  },
  data() {
    return {
      selectedBannerType: "main",
      banners: { main: [], sub: [] },
      staticBannerError: false,
      loading: false,
      error: false
    };
  },
  computed: {
    ...mapGetters(["client", "subscription", "languageCode", "dateRange"]),
    ...mapGetters("settings", ["webSettings", "installationSettings"]),
    addBannersLink() {
      let lang = "";
      if (this.languageCode === "es") {
        lang = "es/";
      }
      return `https://help.datacue.co/${lang}install/${this.client.type}.html`;
    },
    tooManyBanners() {
      if (!this.subscription?.name || !this.banners) {
        return false;
      }
      return (
        (this.banners.main || []).length + (this.banners.sub || []).length >=
        this.bannerLimit
      );
    },
    bannerLimit() {
      if (!this.subscription?.name) {
        return 0;
      }
      return (
        this.subscription?.access?.personalization?.banners?.banner_limit || 0
      );
    },
    selBanners() {
      if (!this.banners || this.banners === {}) {
        return [];
      }
      return this.banners[this.selectedBannerType];
    },
    bannerLayout() {
      return this.webSettings?.recommendations?.banners?.type || "";
    }
  },
  methods: {
    ...mapActions("settings", [
      "getWebSettings",
      "getPageInstallationSettings"
    ]),
    getBannerLabel(type) {
      let labels = ["wide", "narrow"];
      if (this.bannerLayout === "custom") {
        labels = ["large", "small"];
      }
      if (type === "main") {
        return labels[0];
      }
      return labels[1];
    },
    async getBannerData() {
      this.loading = true;
      let dates = this.dateRange || [];
      if (dates.length != 2) {
        return;
      }
      try {
        let response = await getPageData(
          `banners?startdate=${dates[0]}&enddate=${dates[1]}`
        );
        this.banners.main =
          (response && response.banners && response.banners.main) || [];
        this.banners.sub =
          (response && response.banners && response.banners.sub) || [];
        if (this.banners.main.length == 0 && this.banners.sub.length > 0) {
          //switch to sub banners if the customer has no main banners uploaded
          this.selectedBannerType = "sub";
        }
      } catch (e) {
        Sentry.captureException(e);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async refreshData() {
      const getBanners = this.getBannerData();
      const getPageInstallationSettings =
        this.getPageInstallationSettings("home");
      const getWebSettings = this.getWebSettings();
      try {
        [
          await getBanners,
          await getPageInstallationSettings,
          await getWebSettings
        ];
      } catch (err) {
        Sentry.captureException(err);
      }

      if (!this.bannerLayout) {
        this.notifyError("please pick a banner layout");
        this.$router.push({ name: "banners settings" });
      }
    },
    notifyError(errorMsg) {
      this.$notify({
        title: this.$t("error"),
        message: this.$t(errorMsg),
        type: "warning"
      });
    },
    editBanner(bannerDetails) {
      this.$router.push({
        name: "edit banner",
        params: { bannerid: bannerDetails.banner_id }
      });
    },
    delBannerCard(bannerID, bannerType) {
      let newBanners = this.banners;
      newBanners[bannerType] = newBanners[bannerType].filter(
        (e) => e.banner_id !== bannerID
      );
      this.banners = newBanners;
    },
    async delBanner(bannerID) {
      this.delBannerCard(bannerID, this.selectedBannerType);
      try {
        await deleteBanner(bannerID);
      } catch (e) {
        this.refreshData(this.dateRange);
        Sentry.captureException(e);
        this.$notify({
          title: this.$t("error"),
          message: this.$t(
            "we could not delete the banner, please try again later"
          ),
          type: "warning"
        });
      }
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
