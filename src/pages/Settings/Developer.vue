<template>
  <div class="developer-settings">
    <card v-if="!trustedClient">
      <h3 slot="header">{{ $t("api settings") }}</h3>
      <api-settings :read-only="true"></api-settings>
    </card>
    <card>
      <h3 slot="header">
        <i class="ti-ruler"></i>
        &nbsp;{{ $t("testing") }}
      </h3>
      <p>{{ $t("show recommendations to a few select users") }}</p>
      <ul>
        <li>
          {{ $t("only the users below will see DataCue recommendations") }}
        </li>
        <li>
          {{
            $t(
              "the selected user must login to see the DataCue recommendations"
            )
          }}
        </li>
      </ul>
      <el-form label-position="left" label-width="180px" @submit.native.prevent>
        <el-form-item :label="$t('test mode')">
          <el-switch v-model="testMode"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('test users')">
          <el-select
            v-model="userIDs"
            :disabled="!testMode"
            multiple
            clearable
            filterable
            remote
            :remote-method="getMatchingUsers"
            :loading="loading"
            :placeholder="$t('select')"
          >
            <el-option
              v-for="item in filteredUsers"
              :key="item.value"
              :label="item.email"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <dc-button :loading="saving" type="primary" @click="saveChanges(false)">
        {{ $t("save") }}
      </dc-button>
    </card>
    <card>
      <h3 slot="header">
        <i class="ti-pin"></i>
        &nbsp;{{ $t("product recommendations placement") }}
      </h3>
      <p>
        {{
          $t(
            "specify a CSS selector for each page type to insert production recommendations"
          )
        }}
      </p>
      <div class="row css-form">
        <div class="col-sm-6">
          <el-form label-position="top">
            <el-form-item :label="$t('page:home')">
              <loader-dots v-if="pageStatus['home'] === 'checking'" />
              <i
                v-else
                :class="
                  pageStatus['home'] === 'found' ? 'ti-check' : 'ti-alert'
                "
              ></i>
              <el-input v-model="cssSelectors.index"></el-input>
            </el-form-item>
            <el-form-item
              :label="
                client.type == 'shopify'
                  ? $t('page:category_shopify')
                  : $t('page:category')
              "
            >
              <loader-dots v-if="pageStatus['category'] === 'checking'" />
              <i
                v-else
                :class="
                  pageStatus['category'] === 'found' ? 'ti-check' : 'ti-alert'
                "
              ></i>
              <el-input v-model="cssSelectors.category"></el-input>
            </el-form-item>
            <el-form-item :label="$t('page:product')">
              <loader-dots v-if="pageStatus['product'] === 'checking'" />
              <i
                v-else
                :class="
                  pageStatus['product'] === 'found' ? 'ti-check' : 'ti-alert'
                "
              ></i>
              <el-input v-model="cssSelectors.product"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="col-sm-6">
          <el-form label-position="top">
            <el-form-item :label="$t('page:404')">
              <loader-dots v-if="pageStatus['404'] === 'checking'" />
              <i
                v-else
                :class="pageStatus['404'] === 'found' ? 'ti-check' : 'ti-alert'"
              ></i>
              <el-input v-model="cssSelectors['404']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('page:cart')">
              <loader-dots v-if="pageStatus['cart'] === 'checking'" />
              <i
                v-else
                :class="
                  pageStatus['cart'] === 'found' ? 'ti-check' : 'ti-alert'
                "
              ></i>
              <el-input v-model="cssSelectors.cart"></el-input>
            </el-form-item>
            <el-form-item :label="$t('page:search')">
              <loader-dots v-if="pageStatus['search'] === 'checking'" />
              <i
                v-else
                :class="
                  pageStatus['search'] === 'found' ? 'ti-check' : 'ti-alert'
                "
              ></i>
              <el-input v-model="cssSelectors.search"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <dc-button :loading="saving" type="primary" @click="saveChanges(true)">
        {{ $t("save") }}
      </dc-button>
    </card>
  </div>
</template>

<script>
import Card from "/src/components/Cards/Card.vue";
import DcButton from "/src/components/DcButton.vue";
import LoaderDots from "/src/components/LoaderDots.vue";

import ApiSettings from "/src/components/onboarding/ApiSettings.vue";
import * as Sentry from "@sentry/browser";
import { mapGetters, mapActions } from "vuex";

import { getPageData } from "/src/api/backend";
const emptyCssSelectors = {
  index: null,
  product: null,
  category: null,
  404: null,
  search: null,
  cart: null,
};
export default {
  name: "Developer",
  components: {
    Card,
    DcButton,
    ApiSettings,
    LoaderDots,
  },
  data() {
    return {
      saving: false,
      loading: false,
      filter: "",
      userIDs: [],
      filteredUsers: [],
      testMode: false,
      cssSelectors: emptyCssSelectors,
    };
  },
  watch: {
    testMode(val) {
      if (!val) {
        this.userIDs = [];
      }
    },
  },
  computed: {
    ...mapGetters(["client", "trustedClient"]),
    ...mapGetters("settings", ["webSettings", "pageStatus"]),
  },
  methods: {
    ...mapActions("settings", [
      "getWebSettings",
      "saveSettings",
      "getPageInstallationSettings",
    ]),
    async saveChanges(css) {
      this.saving = true;
      this.setTestMode();
      const newSettings = this.webSettings;
      newSettings.testing.user_ids = this.userIDs;
      newSettings.recommendations.products["css-selectors"] = this.cssSelectors;
      try {
        if (css) {
          const saveSettings = this.saveSettings({ web_settings: newSettings });
          const reloadPageSettings = this.getPageInstallationSettings("all");
          let resp = [await saveSettings, reloadPageSettings];
        } else {
          await this.saveSettings({ web_settings: newSettings });
        }
        this.$notify({
          title: this.$t("success"),
          message: this.$t("saved"),
          type: "success",
        });
      } catch (err) {
        Sentry.captureException(err);
        this.$notify({
          title: this.$t("could not save"),
          message: this.$t("an unknown error occured, please try again later"),
          type: "warning",
        });
      } finally {
        this.saving = false;
      }
    },
    getMatchingUsers(query) {
      if (!query) {
        return;
      }
      getPageData(`/users/emails?filter=${query}`)
        .then((resp) => {
          this.filteredUsers = resp.test_users;
        })
        .catch((err) => {
          Sentry.captureException(err);
        });
    },
    async refreshData() {
      let filter = this.client.domain || "";
      try {
        const getUsers = getPageData(`/users/emails?filter=${filter}`);
        const webSettings = this.getWebSettings();
        let resp = [await getUsers, webSettings];
        this.filteredUsers = resp[0].test_users;
        this.userIDs =
          (this.webSettings.testing && this.webSettings.testing.user_ids) || [];
        this.setTestMode();
        this.cssSelectors =
          (this.webSettings.recommendations &&
            this.webSettings.recommendations.products &&
            this.webSettings.recommendations.products["css-selectors"]) ||
          emptyCssSelectors;
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    setTestMode() {
      this.testMode = this.userIDs.length > 0;
    },
  },
  mounted() {
    this.userIDs =
      (this.webSettings.testing && this.webSettings.testing.user_ids) || [];
    this.setTestMode();
    this.refreshData();
  },
};
</script>
<style lang="scss" scoped>
@import "/src/assets/sass/datacue/_colors.scss";
.developer-settings .el-select {
  width: 100%;
}
.css-form i {
  position: absolute;
  top: 0em;
  font-size: 1.5em;
  padding: 10px;
  min-width: 40px;
  z-index: 99;
}

.css-form i.ti-alert {
  color: $red;
}
.css-form i.ti-check {
  color: $green;
}
</style>
<style>
.css-form input {
  width: 100%;
  padding: 10px;
  padding-left: 3em;
}
</style>
