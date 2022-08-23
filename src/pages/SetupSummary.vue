<template>
  <div class="row setup-summary">
    <div class="col-12">
      <card>
        <h3 slot="header">
          <i class="ti-panel"></i>
          &nbsp;{{
            $t(
              `setupSummary:ActivateDataCue:${
                hasSelectedPlan && recommendationsReady
              }`
            )
          }}
        </h3>
        <div class="row">
          <div v-if="hasSelectedPlan && recommendationsReady" class="col-12">
            <template v-if="hasEnoughOrders.done">
              <el-checkbox
                :disabled="!!recommendationsReady"
                :value="!!recommendationsReady"
              />
              <p class="el-checkbox__label">
                {{ $t(`setupSummary:RecsReady:title`) }}
              </p>
              <p>{{ $t(`setupSummary:RecsReady:subtext`) }}</p>
            </template>
            <template v-else>
              <loading-circle />
              <p class="el-checkbox__label">
                {{ $t(`setupSummary:RecsReady:InsufficentOrders:title`) }}
              </p>
              <p>
                {{ $t(`setupSummary:RecsReady:InsufficentOrders:subtext`) }}
              </p>
              <el-progress
                v-if="hasEnoughOrders.pct > 0"
                :text-inside="true"
                :stroke-width="22"
                :percentage="hasEnoughOrders.pct"
                status="warning"
              />
            </template>
          </div>
          <div v-else-if="!hasSelectedPlan" class="col-12">
            <el-checkbox :disabled="true" :value="false" />
            <p class="el-checkbox__label">
              {{ $t(`setupSummary:NoPlanSelected:title`) }}
            </p>
            <p>
              {{ $t(`setupSummary:NoPlanSelected:subtitle`) }}
            </p>
            <dc-button
              type="primary"
              @click="$router.push({ name: 'billing' })"
            >
              {{ $t("setupSummary:NoPlanSelected:btn") }}
            </dc-button>
          </div>
          <template v-else>
            <div class="col-12">
              <template v-if="hasProductsAndCategories">
                <loading-circle />
                <p class="el-checkbox__label">
                  {{ $t(`setupSummary:RecsNotReady:title`) }}
                </p>
                <p>{{ $t(`setupSummary:RecsNotReady:subtext`) }}</p>
              </template>
              <template v-else>
                <template v-if="trustedClient">
                  <loading-circle />
                  <p class="el-checkbox__label">
                    {{ $t(`setupSummary:RecsNotReady:SyncingStoreData:title`) }}
                  </p>
                  <p>
                    {{
                      $t(`setupSummary:RecsNotReady:SyncingStoreData:subtext`)
                    }}
                  </p>
                </template>
                <template v-else>
                  <p class="el-checkbox__label">
                    {{ $t(`setupSummary:RecsNotReady:InstallPlugin:title`) }}
                  </p>
                  <p>
                    {{ $t(`setupSummary:RecsNotReady:InstallPlugin:subtext`) }}
                  </p>
                  <dc-button
                    tag="a"
                    type="primary"
                    href="https://help.datacue.co/install"
                  >
                    {{ $t("setupSummary:RecsNotReady:InstallPlugin:btn") }}
                  </dc-button>
                </template>
              </template>
            </div>
          </template>
        </div>
      </card>
    </div>
    <div class="col-sm-12 col-md-6">
      <card>
        <h3 slot="header">
          <i class="ti-image"></i>
          &nbsp;{{ $tc("banners", 2) }}
        </h3>
        <div class="row">
          <div :class="{ 'col-12': true, done: bannerSectionFound }">
            <el-checkbox
              :disabled="!!bannerSectionFound"
              :value="!!bannerSectionFound"
            />
            <p class="el-checkbox__label">
              {{
                $t(`setupSummary:banners:section:${bannerSectionFound}:title`)
              }}
            </p>
            <p>
              {{ $t(`setupSummary:banners:section:subtext`) }}
            </p>
            <dc-button
              type="primary"
              tag="a"
              :href="installationGuideLink"
              v-if="!bannerSectionFound"
            >
              {{ $t(`setupSummary:banners:section:btn`) }}
            </dc-button>
          </div>

          <div :class="{ 'col-12': true, done: hasEnoughBanners.done }">
            <el-checkbox
              :disabled="hasEnoughBanners.done"
              :value="hasEnoughBanners.done"
            />

            <p class="el-checkbox__label">
              {{
                $t(
                  `setupSummary:banners:uploads:${hasEnoughBanners.done}:title`
                )
              }}
            </p>
            <p>
              {{ $t(`setupSummary:banners:uploads:subtext`) }}
            </p>
            <p v-if="!hasEnoughBanners.done">
              <span>{{
                $t("setupSummary:banners:uploads:insufficient:banner", {
                  name: $t(getBannerLabel("main")),
                  count: hasEnoughBanners.main.expected
                })
              }}</span>
              <el-progress
                :text-inside="true"
                :stroke-width="22"
                :percentage="hasEnoughBanners.main.count"
                status="warning"
              />
              <span>{{
                $t("setupSummary:banners:uploads:insufficient:banner", {
                  name: $t(getBannerLabel("sub")),
                  count: hasEnoughBanners.sub.expected
                })
              }}</span>
              <el-progress
                :text-inside="true"
                :stroke-width="22"
                :percentage="hasEnoughBanners.sub.count"
                status="warning"
              />
            </p>
            <router-link to="/banners/add">
              <dc-button type="primary">
                {{ $t("add banner") }}
              </dc-button>
            </router-link>
          </div>
        </div>
      </card>
    </div>
    <div class="col-sm-12 col-md-6">
      <card>
        <h3 slot="header">
          <i class="ti-package"></i>
          &nbsp;{{ $tc("products", 2) }}
        </h3>
        <div class="row">
          <div :class="{ 'col-12': true, done: productSectionFound }">
            <el-checkbox
              :disabled="!!productSectionFound"
              :value="!!productSectionFound"
            />
            <p class="el-checkbox__label">
              {{
                $t(`setupSummary:products:section:${productSectionFound}:title`)
              }}
            </p>
            <p>
              {{ $t(`setupSummary:products:section:subtext`) }}
            </p>
            <dc-button
              type="primary"
              tag="a"
              :href="installationGuideLink"
              v-if="!productSectionFound"
            >
              {{ $t(`setupSummary:products:section:btn`) }}
            </dc-button>
          </div>

          <div :class="{ 'col-12': true, done: hasDesignedProductSection }">
            <el-checkbox
              :disabled="hasDesignedProductSection"
              :value="hasDesignedProductSection"
            />

            <p class="el-checkbox__label">
              {{
                $t(
                  `setupSummary:products:designed:${hasDesignedProductSection}:title`
                )
              }}
            </p>
            <p>
              {{ $t("setupSummary:products:designed:subtext") }}
            </p>
            <router-link
              :to="{ path: '/settings/products', hash: '#designer' }"
            >
              <dc-button type="primary">
                {{ $t("setupSummary:products:designed:btn") }}
              </dc-button>
            </router-link>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import LoadingCircle from "@/components/LoadingCircle.vue";
import { mapGetters, mapActions } from "vuex";

import Card from "@/components/Cards/Card.vue";
import DcButton from "@/components/DcButton.vue";

export default {
  components: {
    Card,
    DcButton,
    LoadingCircle
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapGetters("settings", ["webSettings"]),
    ...mapGetters(["client", "languageCode", "trustedClient"]),
    ...mapGetters("onboarding", ["setupSummary", "hasFinishedSetup"]),
    bannerSectionFound() {
      return this?.setupSummary?.bannerSectionFound ?? false;
    },
    productSectionFound() {
      return this?.setupSummary?.productSectionFound ?? false;
    },
    hasDesignedProductSection() {
      return this?.setupSummary?.productSectionDesigned ?? false;
    },
    hasSelectedPlan() {
      return this?.setupSummary?.hasSelectedPlan ?? false;
    },
    recommendationsReady() {
      return this?.setupSummary?.recommendationsReady ?? false;
    },
    hasEnoughBanners() {
      return (
        this?.setupSummary?.bannersUploaded ?? {
          done: false,
          main: {
            count: 0,
            expected: 2
          },
          sub: {
            count: 0,
            expected: 5
          }
        }
      );
    },
    hasEnoughOrders() {
      const orders = this.setupSummary?.storeData?.orders ?? {
        done: false,
        num: 0,
        expected: 1
      };
      return {
        ...orders,
        pct: (Math.min(orders.num, orders.expected) / orders.expected) * 100
      };
    },
    hasProductsAndCategories() {
      return this.setupSummary?.storeData?.productsAndCategories ?? false;
    },
    installationGuideLink() {
      const supportedPlatforms = [
        "shopify",
        "woocommerce",
        "prestashop",
        "magento"
      ];

      let platform = this?.client?.type ?? "";
      let lang = "";

      if (!supportedPlatforms.includes(platform)) {
        platform = "custom";
      }

      if (["es"].includes(this.languageCode)) {
        lang = this.languageCode + "/";
      }

      return `https://help.datacue.co/${lang}install/${platform}.html`;
    }
  },
  methods: {
    ...mapActions("settings", ["getPageInstallationSettings"]),
    ...mapActions("onboarding", ["fetchSetupSummary", "finishSetup"]),
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
    async refresh() {
      this.loading = true;
      try {
        let response = [
          this.getPageInstallationSettings("home"),
          await this.fetchSetupSummary()
        ];
        await Promise.allSettled(response);
        if (this.hasFinishedSetup) {
          this.finishSetup();
          await this.$router.push({ name: "summary" });
        }
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>
<style lang="scss" scoped>
.setup-summary:deep {
  // .refresh {
  //   float: right;

  //   img {
  //     height: 14px;
  //     margin-right: 0.5em;
  //   }
  // }

  .el-checkbox,
  .el-checkbox__input {
    cursor: default;
  }

  .el-checkbox__label {
    font-size: 16px;
    font-weight: bold;
    color: #252422;
  }

  .el-checkbox__inner {
    border: 1px solid #252422;
  }

  p {
    padding-left: 25px;

    &.el-checkbox__label {
      margin-top: -24px;
      margin-bottom: 5px;
      display: block;
    }
  }

  .done {
    p {
      color: #c0c4cc;
    }
  }
  .button-container {
    display: block;
    height: 50px;
  }
  a.dc-button,
  button {
    margin-left: 25px;
    margin-bottom: 20px;
  }
  svg.loading-circle {
    width: 20px;
    display: inline-block;
  }
}
</style>
