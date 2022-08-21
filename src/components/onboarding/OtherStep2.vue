<template>
  <el-form class="api-info">
    <div class="row">
      <div class="col-12" v-if="!noData">
        <label :class="toggleKeyClass">
          <span @click="showKeys = !showKeys">
            <eye-show-icon v-show="!showKeys"></eye-show-icon>
            <eye-hide-icon v-show="showKeys"></eye-hide-icon>
            {{
              showKeys
                ? $t("hide api key and secret")
                : $t("show api key and secret")
            }}
          </span>
        </label>
      </div>

      <template v-if="showKeys">
        <div class="col-12">
          <p class="info">
            {{ $t("use the credentials below to connect to datacue's api") }}:
          </p>
        </div>
        <div class="col-12">
          <el-form-item label="API key:">
            <el-input
              :value="client.apikey"
              class="float-md-left"
              readonly
            ></el-input>
            <copy-button
              @copy="$clipboard(client.apikey)"
              class="float-right float-md-left"
            ></copy-button>
          </el-form-item>
        </div>
        <div class="col-12">
          <el-form-item label="API secret:">
            <el-input
              :value="atob(client.apisecret)"
              class="float-md-left"
              readonly
            ></el-input>
            <copy-button
              @copy="$clipboard(atob(client.apisecret))"
              class="float-right float-md-left"
            ></copy-button>
          </el-form-item>
        </div>
        <div class="col-12 first-tip">
          <dc-tip
            v-if="platformWithPlugin"
            :message="
              $t('you can access above data later under developer settings.')
            "
          />
          <dc-tip
            v-else
            :message="
              $t('copy and save your api key and api secret in a secure place.')
            "
          />
        </div>
      </template>

      <div class="col-12 col-lg-4 text-center text-lg-left">
        <dc-button
          v-if="platformWithPlugin"
          type="primary"
          @click="openApiGuide"
          >{{ $t("install plugin") }}</dc-button
        >
        <dc-button v-else type="primary" @click="openApiGuide">{{
          $t("launch api guide")
        }}</dc-button>
      </div>
      <div class="col-12 col-lg-8 second-tip">
        <dc-tip
          v-if="platformWithPlugin"
          :message="
            $t(
              'paste the above api credentials in your datacue plugin settings in your {platform} store.',
              { platform: platform }
            )
          "
        />
        <dc-tip
          v-else
          :message="
            $t(
              'replace the api key and api secret values in the api guide sample code with these.'
            )
          "
        />
      </div>

      <div class="col-12 data-info">
        <p v-if="noData">{{ afterSetupTip }}</p>

        <template v-else>
          <p>{{ $t("receivedDataInfo") }}</p>

          <p>{{ $t("refetchData") }}</p>
        </template>
      </div>

      <div v-if="!noData" class="col-12 product-data">
        <store-data
          @refresh="refresh"
          :refreshing="refreshing"
          :store-data="data"
        ></store-data>
      </div>

      <div v-if="refreshed && noData && !error" class="col-12">
        <dc-alert
          class="my-2"
          :message="$t('no data yet, please make sure it is set up correctly.')"
        />
      </div>

      <div v-if="error" class="col-12">
        <dc-alert class="my-2" :message="error" />
      </div>

      <div class="col-12 text-center text-lg-left">
        <dc-button
          v-if="noData"
          type="refresh"
          @click="refresh('')"
          :loading="loading"
        >
          <refresh-icon v-show="!loading" />
          {{ $t("refresh") }}
        </dc-button>

        <btn-next
          v-else
          :loading="loading"
          :disabled="disableSubmit"
          @click="finish"
        />

        <hr class="d-none d-lg-block" />
      </div>

      <div v-if="successHelp" class="col-12">
        <dc-alert type="success" class="mt-2 mb-md-4" :message="emailSubject" />
      </div>

      <div class="col-12 col-lg-8 assistance">
        <hr class="d-lg-none" />
        <div class="row">
          <div class="col-1 icon">
            <img alt src="@/assets/img/need-help.svg" />
          </div>
          <div class="col message">
            <span class="title">{{ $t("need a hand") }}?</span>
            {{
              $t(
                "let us know and we'll setup a video call to walk you through the installation"
              )
            }}.
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4 text-center text-lg-right">
        <dc-button @click="needHelp" type="outline" :loading="sendingEmail">{{
          $t("i need help")
        }}</dc-button>
      </div>
    </div>
  </el-form>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { getPageData, postSendEmail } from "@/api/backend";
import { mapActions, mapGetters } from "vuex";

import BtnNext from "@/components/onboarding/BtnNext";
import CopyButton from "@/components/onboarding/CopyButton";
import StoreData from "@/components/onboarding/StoreData";

import DcTip from "@/components/DcTip";
import DcAlert from "@/components/DcAlert";
import DcButton from "@/components/DcButton";
import EyeHideIcon from "@/components/icons/EyeHideIcon";
import EyeShowIcon from "@/components/icons/EyeShowIcon";
import RefreshIcon from "@/components/icons/RefreshIcon";

export default {
  components: {
    BtnNext,
    CopyButton,
    DcAlert,
    DcButton,
    DcTip,
    EyeHideIcon,
    EyeShowIcon,
    StoreData,
    RefreshIcon
  },
  data() {
    return {
      error: "",
      showKeys: true,
      loading: false,
      successHelp: false,
      sendingEmail: false,
      refreshed: false,
      refreshing: [], // Used to determine what type is refreshing
      storeData: {}
    };
  },
  computed: {
    ...mapGetters(["client"]),
    toggleKeyClass() {
      return {
        "form-check-label": true,
        "toggle-keys": true,
        visible: this.showKeys
      };
    },
    noData() {
      return this.data.length === 0;
    },
    disableSubmit() {
      if (this.noData) {
        return true;
      }
      const pending = this.data.find(item => !item.done);
      return pending ? true : false;
    },
    platform() {
      return this.client.type;
    },
    platformWithPlugin() {
      return ["woocommerce", "prestashop"].includes(this.platform);
    },
    emailSubject() {
      return this.$t("we’ve received your help request and will be in touch…");
    },
    btnRefreshClass() {
      return {
        refresh: true,
        "btn-yellow": !this.platformWithPlugin,
        "btn-yellow-outline": this.platformWithPlugin,
        "btn-large": true,
        rounded: true
      };
    },
    afterSetupTip() {
      if (this.platformWithPlugin) {
        return this.$t(
          "after plugin installation, click refresh to verify that your store data was synced successfully."
        );
      } else {
        return this.$t("afterImplementation");
      }
    },
    apiGuideUrl() {
      let url = "https://developer.datacue.co/#introduction";
      if (this.platformWithPlugin) {
        const locale = this.$i18n.locale;
        if (locale && locale !== "en") {
          url = `https://help.datacue.co/${locale}/install/${this.platform}.html`;
        } else {
          url = `https://help.datacue.co/install/${this.platform}.html`;
        }
      }
      return url;
    }
  },
  methods: {
    ...mapActions("onboarding", ["finishOnboarding"]),
    atob(val) {
      return atob(val);
    },
    openApiGuide() {
      window.open(this.apiGuideUrl, "_blank");
    },
    needHelp() {
      this.successHelp = false;
      this.sendingEmail = true;
      const data = {
        email_type: "need_help",
        lang: this.$route.params.lang,
        subject: this.emailSubject
      };
      postSendEmail(data)
        .then(() => {
          this.successHelp = true;
          setTimeout(() => {
            this.successHelp = false;
          }, 3000);
        })
        .catch(err => {
          Sentry.captureException(err);
        })
        .finally(() => {
          this.sendingEmail = false;
        });
    },
    refresh(type) {
      this.error = "";
      let url = "client/overview";

      if (type) {
        type = type.toLowerCase();
        url = `${url}?type=${type}`;
        this.refreshing.push(type);
      } else {
        this.loading = true;
        this.refreshed = false;
      }
      getPageData(url)
        .then(responseData => {
          //check if we got a valid response
          if (responseData.hasOwnProperty("products")) {
            this.data = responseData;
          } else {
            this.error = this.$t(
              "an unknown error occured, please try again later"
            );
            Sentry.captureException(
              new Error(
                `Could not find 'products' in ${JSON.stringify(responseData)}`
              )
            );
          }
        })
        .catch(err => {
          this.error = this.$t(
            "an unknown error occured, please try again later"
          );
          Sentry.captureException(err);
        })
        .finally(() => {
          this.loading = false;
          this.refreshed = true;
          const idx = this.refreshing.findIndex(item => item == type);
          if (idx >= 0) {
            this.refreshing.splice(idx, 1);
          }
        });
    },
    finish() {
      this.loading = true;
      this.finishOnboarding()
        .then(() => {
          this.$emit("submit");
        })
        .catch(err => {
          Sentry.captureException(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~sass/datacue/_colors.scss";

hr {
  border-color: $gray-light;
}

label.toggle-keys {
  cursor: pointer;
  font-size: 1em;
  color: $gray;
  fill: $gray;

  &.visible {
    margin-bottom: 25px;
  }

  &:hover {
    fill: $primary;
    color: $primary;
  }

  svg {
    width: 25px;
    height: 13px;
    margin-bottom: 3px;
  }
}

p.info {
  color: $dark;
  margin-bottom: 20px;
}

.data-info {
  p {
    color: $dark;

    @media (max-width: 992px) {
      margin-top: 30px;
      margin-bottom: 0;
    }
  }
}

.product-data {
  margin-top: 30px;
}

.el-form.api-info::v-deep {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    font-weight: bold;
    color: $dark;
    font-size: 16px;
    margin: 10px 0 15px 0;
    line-height: 1;

    @media (min-width: 768px) {
      float: none;
      margin-top: 30px;
    }

    @media (min-width: 1200px) {
      float: left;
      min-width: 100px;
    }
  }
}

.first-tip {
  margin-top: 30px;
}

.btn-plugin,
.btn-yellow-outline {
  margin: 30px 0 30px;
  min-width: 150px;
}

.refresh {
  margin: 30px 0;

  svg {
    width: 20px;
    margin-right: 10px;
    margin-bottom: 2px;
  }
}

.assistance {
  hr {
    border-color: $gray-light;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .icon {
    width: 55px;
    min-width: 55px;

    img {
      height: 40px;
    }
  }

  .title {
    color: $primary;
    font-weight: bold;
    text-transform: uppercase;
  }

  .message {
    color: $dark;
    padding-left: 5px;
  }
}

.btn-help {
  margin-top: 15px;
}

@media (min-width: 768px) {
  p.info {
    margin-bottom: 0;
  }

  .el-input {
    width: 330px;
  }

  label.copy {
    margin-left: 15px;
  }
}

@media (min-width: 992px) {
  .second-tip {
    margin-top: 30px;
    padding-left: 30px;
  }

  .btn-help {
    margin-top: 0;
  }
}

@media (min-width: 1200px) {
  p.info {
    margin-bottom: 10px;
  }

  .el-input {
    margin-top: 20px;
  }

  label.copy {
    margin-top: 30px;
  }
}
</style>
