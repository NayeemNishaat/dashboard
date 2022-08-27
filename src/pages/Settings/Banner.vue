<template>
  <div>
    <pending-settings v-if="!onboarding" :has-unsaved-changes="hasUnsavedChanges" :saving="saving"
      @save="saveChanges" />
    <loader-dots v-if="!current" />
    <template v-else>
      <div class="row">
        <div class="col-12">
          <card>
            <h3 slot="header">
              <i class="ti-layout-grid2"></i>
              &nbsp;{{ $t(titles[0]) }}
            </h3>
            <div>
              {{ $t(titles[1]) }}
            </div>
            <transition name="fade">
              <div class="banner-grid-selection" v-if="current.type != 'custom'">
                <el-radio-group v-model="current.type" @change="saveIfOnboarding">
                  <el-radio v-for="(layout, idx) in allowedLayouts" :key="idx" :label="layout">{{ $t(layout) }}&nbsp;<i
                      v-if="!allowedLayouts.includes(layout)" class="ti-lock" /></el-radio>
                </el-radio-group>
                <dc-upgrade-message v-if="!selectedBannerTypeAllowed"
                  :message="$t(`upgrade your plan to use this layout`)" />
                <dc-message-banner v-else icon="ti-light-bulb" :message="bannerRecommendation" />
              </div>
              <dc-message-banner v-else type="error">{{ $t("custom layout selected") }}
              </dc-message-banner>
            </transition>
            <transition name="fade">
              <div class="row" v-if="current.type === 'low'">
                <div class="col-md-6 col-sm-12 img-col">
                  <img src="@/assets/img/banner-layout/low-desktop.jpg" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <el-collapse>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="static"></dt>
                          <dd>{{ $t("1 static banner") }}</dd>
                        </dl>
                      </slot>
                      <banner-description type="static" />
                    </el-collapse-item>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="dynamic"></dt>
                          <dd>
                            {{ $t("dynamic banner count", { count: 2 }) }}
                          </dd>
                        </dl>
                      </slot>
                      <banner-description type="low" />
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
              <div class="row" v-else-if="current.type === 'medium'">
                <div class="col-md-6 col-sm-12 img-col">
                  <img src="@/assets/img/banner-layout/medium-desktop.jpg" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <el-collapse>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="static"></dt>
                          <dd>{{ $t("1 static banner") }}</dd>
                        </dl>
                      </slot>
                      <banner-description type="static" />
                    </el-collapse-item>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="dynamic"></dt>
                          <dd>
                            {{ $t("dynamic banner count", { count: 3 }) }}
                          </dd>
                        </dl>
                      </slot>
                      <banner-description type="medium" />
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
              <div class="row" v-else-if="current.type === 'high'">
                <div class="col-md-6 col-sm-12 img-col">
                  <img src="@/assets/img/banner-layout/high-desktop.jpg" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <el-collapse>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="static"></dt>
                          <dd>{{ $t("1 static banner") }}</dd>
                        </dl>
                      </slot>
                      <banner-description type="static" />
                    </el-collapse-item>
                    <el-collapse-item>
                      <slot name="title">
                        <dl>
                          <dt class="dynamic"></dt>
                          <dd>
                            {{ $t("dynamic banner count", { count: 4 }) }}
                          </dd>
                        </dl>
                      </slot>
                      <banner-description type="high" />
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </transition>
          </card>
        </div>
      </div>
      <div class="row" v-if="!onboarding">
        <div class="col-12">
          <card>
            <h3 slot="header">
              <i class="ti-image"></i>
              &nbsp;{{ $t("static banner") }}
            </h3>
            <div class="row">
              <div class="col-sm-6 col-xs-12">
                <template v-if="!staticBannerLoading">
                  <img v-if="installationSettings.static_banner.photo_url"
                    :src="installationSettings.static_banner.photo_url" style="max-width: 100%" />
                  <p v-else>{{ $t("no static banner") }}</p>
                </template>
                <loader-dots v-else></loader-dots>
              </div>
              <div class="col-sm-6 col-xs-12">
                <div v-html="
                  $t(
                    `static banner description:${installationSettings.static_banner.photo_url
                      ? 'found'
                      : 'notfound'
                    }`
                  )
                " />
                <dc-button class="btn-add-static-banner" tag="a" :href="staticBannerLink" type="outline">{{
                    $t(
                      installationSettings.static_banner.photo_url
                        ? "change static banner"
                        : "add static banner"
                    )
                }}
                </dc-button>
              </div>
            </div>
          </card>
        </div>
      </div>
      <div class="row" v-if="!onboarding">
        <div class="col-12">
          <card>
            <h3 slot="header">
              <i class="ti-pencil"></i>
              &nbsp;{{ $t("custom banner layout") }}
            </h3>
            <div>{{ $t("custom banner description") }}</div>
            <dc-upgrade-message v-if="!bannerAccess.custom_layout" :message="
              $t('upgrade your plan to design your own banner layout')
            " />
            <div class="view-docs-btn">
              <dc-button tag="a" :href="recommendationLink" type="outline">{{ $t("view docs") }}
              </dc-button>
            </div>
            <el-switch v-model="custom" active-color="#fab800" inactive-color="#80848e"
              :disabled="!bannerAccess.custom_layout" :active-text="$t('on')" :inactive-text="$t('off')">
            </el-switch>
            <el-form label-position="top" label-width="180px" v-if="current.type === 'custom'">
              <el-form-item :label="$t('large banners')">
                <el-slider v-model="current.main_banners" :step="1" :max="20" :min="0" show-input></el-slider>
              </el-form-item>
              <el-form-item :label="$t('small banners')">
                <el-slider v-model="current.sub_banners" :step="1" :max="20" :min="0" show-input></el-slider>
              </el-form-item>
            </el-form>
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Card from "@/components/Cards/Card.vue";
import PendingSettings from "@/components/Settings/PendingSettings.vue";
import BannerDescription from "@/components/Settings/BannerDescription.vue";
import DcButton from "@/components/DcButton.vue";
import DcMessageBanner from "@/components/DcMessageBanner.vue";
import DcUpgradeMessage from "@/components/DcUpgradeMessage.vue";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import LoaderDots from "@/components/LoaderDots.vue";
import * as Sentry from "@sentry/browser";

export default {
  name: "BannerSettings",
  components: {
    Card,
    LoaderDots,
    PendingSettings,
    BannerDescription,
    DcButton,
    DcMessageBanner,
    DcUpgradeMessage
  },
  data() {
    return {
      saving: false,
      staticBannerLoading: false,
      default: {
        type: "low",
        main_banners: 1,
        sub_banners: 2
      },
      current: null,
      lastSaved: null
    };
  },
  props: {
    onboarding: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["client", "subscription", "languageCode"]),
    ...mapGetters("settings", ["webSettings", "installationSettings"]),
    allowedLayouts() {
      if (this.onboarding || !this.bannerAccess.allowed_layouts) {
        return ["low"];
      }
      return this.bannerAccess.allowed_layouts || ["low"];
    },
    bannerAccess() {
      let bannerAccess = this.subscription?.access?.personalization
        ?.banners || {
        banner_limit: 0,
        custom_layout: false,
        allowed_layouts: ["low"]
      };
      if (!bannerAccess.allowed_layouts) {
        bannerAccess.allowed_layouts = ["low"];
      }
      return bannerAccess;
    },
    bannerRecommendation() {
      if (!this.current || this.current === "custom") {
        return "";
      }
      return this.$t(`${this.current.type} rec`);
    },
    titles() {
      if (this.onboarding) {
        return [
          "we picked a banner layout for you",
          "just create 3 banners to start, one wide banner (1200 x 720 px) and two narrow (480 x 720 px)"
        ];
      }
      return ["select banner layout", "how many dynamic banners do you want?"];
    },
    recommendationLink() {
      let lang = "";
      if (this.languageCode === "es") {
        lang = "es/";
      }
      return `https://help.datacue.co/${lang}${this.client.type}/install/advanced.html#custom-banner-layout`;
    },
    staticBannerLink() {
      let lang = "";
      if (this.languageCode === "es") {
        lang = "es/";
      }
      return `https://help.datacue.co/${lang}install/${this.client.type}.html#changing-your-static-banner-later`;
    },
    custom: {
      get() {
        return this.current.type === "custom";
      },
      set(v) {
        if (v) {
          this.$set(this.current, "type", "custom");
          return;
        }
        const layoutType =
          this.lastSaved.type !== "custom" ? this.lastSaved.type : "medium";
        this.$set(this.current, "type", layoutType);
      }
    },
    banners() {
      let banners;
      try {
        banners = this.webSettings.recommendations.banners;
      } catch {
        banners = null;
      }
      if (!banners) {
        return null;
      }

      if (!banners.type) {
        banners.type = this.guessBannerType(banners.main_banners);
      }
      return banners;
    },
    selectedBannerTypeAllowed() {
      if (!this.bannerAccess || !this.current) {
        return false;
      }
      return (
        (this.bannerAccess.custom_layout && this.current.type === "custom") ||
        this.allowedLayouts.includes(this.current.type)
      );
    },
    hasUnsavedChanges() {
      return (
        this.selectedBannerTypeAllowed && !isEqual(this.current, this.lastSaved)
      );
    }
  },
  methods: {
    ...mapActions("settings", [
      "getWebSettings",
      "saveSettings",
      "getPageInstallationSettings"
    ]),
    async refreshStaticBannerInfo() {
      this.staticBannerLoading = true;
      try {
        await this.getPageInstallationSettings("home");
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.staticBannerLoading = false;
      }
    },
    submitForm() {
      this.saveChanges();
    },
    saveIfOnboarding() {
      if (this.onboarding) {
        this.saveChanges();
      }
    },
    getMainBannerCountFromType(type) {
      switch (type) {
        case "low":
          return 1;
        case "medium":
          return 2;
        case "high":
          return 3;
        default:
          return 1;
      }
    },
    async saveChanges() {
      if (!this.selectedBannerTypeAllowed) {
        return;
      }
      this.saving = true;
      try {
        const newSettings = cloneDeep(this.webSettings);
        if (this.current.type !== "custom") {
          this.current.sub_banners = 2;
          this.current.main_banners = this.getMainBannerCountFromType(
            this.current.type
          );
        }
        newSettings.recommendations.banners = cloneDeep(this.current);
        await this.saveSettings({ web_settings: newSettings });
        this.lastSaved = cloneDeep(this.banners || {});
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.saving = false;
      }
    },
    guessBannerType(main_banners) {
      if (!main_banners) {
        return "";
      }
      switch (main_banners) {
        case (0, 1):
          return "low";
        case 2:
          return "medium";
        case 3:
          return "high";
        default:
          return "low";
      }
    },
    async refreshData() {
      try {
        const webSettings = this.getWebSettings();
        const installationSettings = this.getPageInstallationSettings("home");
        [await webSettings, await installationSettings];
        this.lastSaved = cloneDeep(this.banners || {});
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.current = cloneDeep(this.banners || this.default);
      }
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

.img-col>img {
  width: 100%;
}

dl {
  background: none;
  display: flex;
  align-items: center;
  height: 48px;
  line-height: 48px;
  font-size: 13px;
  margin: 0px;
  padding: 0px;
}

dd {
  margin: 0px;
}

dt {
  width: 12px;
  height: 12px;
  margin-right: 0.5em;
}

dt.dynamic {
  background-color: $primary;
}

dt.static {
  background-color: $gray;
}

.banner-grid-selection {
  padding: 20px 0px;
}

.view-docs-btn {
  margin-top: 2em;
  margin-bottom: 2em;
}

span.btn-add-static-banner {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
