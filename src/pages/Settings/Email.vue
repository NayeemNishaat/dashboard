<template>
  <div>
    <card>
      <h3 slot="header">
        <i class="ti-email"></i>
        &nbsp;{{ $t("what email address should we use to send your email?") }}
      </h3>
      <el-alert
        v-if="submitted"
        :title="
          $t('you will receive an email shortly', {
            address: settings.mailing_address
          })
        "
        type="success"
      ></el-alert>
      <el-form
        ref="email-form"
        label-position="top"
        label-width="100px"
        :model="settings"
        @submit.native.prevent
      >
        <el-form-item
          :label="$t('email address')"
          prop="mailing_address"
          :rules="validationRules"
        >
          <el-input v-model="settings.mailing_address">
            <template slot="append">
              <el-tag
                v-if="
                  settings.mailing_address === savedAddress &&
                    savedAddressVerified
                "
                size="mini"
                type="success"
                >{{ $t("verified") }}</el-tag
              >
              <el-tag
                v-else-if="
                  settings.mailing_address === savedAddress &&
                    !savedAddressVerified
                "
                size="mini"
                type="danger"
                >{{ $t("not verified") }}</el-tag
              >
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="disableSubmit"
            :loading="saving"
            type="warning"
            @click="submitForm()"
          >
            <i class="ti-save"></i>
            &nbsp;{{ $t("save") }}
          </el-button>
          <el-button
            v-if="
              settings.mailing_address === savedAddress && !savedAddressVerified
            "
            @click="refreshStatus()"
          >
            {{ $t("refresh") }}
          </el-button>
        </el-form-item>
      </el-form>
    </card>
    <card>
      <h3 slot="header">
        <i class="ti-reload"></i>
        &nbsp;{{ $t("platform sync", { platform: "Mailchimp" }) }}
      </h3>
      <p>
        {{
          $t(
            "platform selection",
        { platform: "Mailchimp" }
        )
        }}
      </p>
      <HR />
      <el-form label-position="top" label-wi    dth="180px">
        <el-f  orm-item :label="$t('api key')">
          <el-input v-model="mailchimp_apikey">
            <template slot="append">
              <el-tag
                v-if="
                  mailchimp_sync_status === 'completed' &&
                    mailchimp_apikey !== ''
                "
                size="mini"
                type="success"
              >{{ $t("synced") }}</el-tag>
            </template>
          </el-input>
        </el-form-item>
        <el  >{{ $t("synced") }}</el-tag
              
            :loading="mailchimp_syncing"
            :disabled="
              mailchimp_sync_status === 'started' ||
                mailchimp_sync_status === 'completed' ||
                mailchimp_apikey === ''
            "
            @click="saveMailChimpApiKey()"
            type="warning"
          >
            <i class="ti-reload"></i>
            &nbsp;{{ $t("sync") }}
          </el-button>
        </el-form-item>
      </el-form>
    </card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Card from "/src/components/Cards/Card.vue";
import LoaderDots from "/src/components/LoaderDots.vue";
import * as Sentry from "@sentry/browser";

export default {
  name: "Email",
  components: {
    Card,
    LoaderDots
  },
  data() {
    return {
      submitted: false,
      saving: false,
      savedAddress: "",
      savedAddressVerified: false,
      settings: {
        mailing_address: ""
      },
      mailchimp_apikey: "",
      mailchimp_sync_status: false,
      mailchimp_syncing: false,
      validationRules: [
        {
          required: true,
          message: this.$t("please input email address"),
          trigger: "blur"
        },
        {
          type: "email",
          message: this.$t("please input a valid email address"),
          trigger: ["blur", "change"]
        }
      ]
    };
  },
  mounted() {
    this.refreshEmailSettings();
  },
  computed: {
    ...mapGetters(["client"]),
    ...mapGetters("settings", ["emailSettings"]),
    disableSubmit() {
      const email = this.settings.mailing_address || "";
      if (
        email.trim() === this.emailSettings.mailing_address ||
        !email.trim()
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapActions("settings", [
      "fetchEmailSettings",
      "saveSettings",
      "saveEmailAddress",
      "saveMailchimp"
    ]),
    refreshEmailSettings() {
      this.fetchEmailSettings().then(() => {
        this.setEmailSettings();
      });
    },
    setEmailSettings() {
      this.settings.mailing_address = this.savedAddress = this.emailSettings.mailing_address;
      this.savedAddressVerified =
        this.emailSettings.mailing_address_status === "success";
      try {
        if (this.emailSettings.subscriber_sync.mailchimp) {
          const mailchimp = this.emailSettings.subscriber_sync.mailchimp;
          this.mailchimp_apikey = mailchimp.apikey;
          this.mailchimp_sync_status = mailchimp.status;
        }
      } catch (err) {
        //pass
      }
    },
    submitForm() {
      this.$refs["email-form"].validate(valid => {
        if (valid) {
          this.saveEmail();
        } else {
          this.$notify({
            title: this.$t("error"),
            message: this.$t("invalid email"),
            type: "warning"
          });
          return false;
        }
      });
    },
    saveMailChimpApiKey() {
      this.mailchimp_syncing = true;
      this.saveMailchimp({ mailchimp_api_key: this.mailchimp_apikey })
        .then(() => {
          this.refreshEmailSettings();
        })
        .catch(err => {
          Sentry.captureException(err);
          this.$notify({
            title: this.$t("error"),
            message: this.$t(
              "an unknown error occured, please try again later"
            ),
            type: "warning"
          });
        });
    },
    saveEmail() {
      this.saving = true;
      this.saveEmailAddress({ mailing_address: this.settings.mailing_address })
        .then(() => {
          this.submitted = true;
          this.refreshEmailSettings();
          this.$notify({
            title: this.$t("success"),
            message: this.$t("saved"),
            type: "success"
          });
        })
        .catch(err => {
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
    }
  }
};
</script>
