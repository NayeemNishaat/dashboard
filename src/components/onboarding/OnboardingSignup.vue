<template>
  <onboarding-step :title="$t('onboarding:signup:title')">
    <template v-slot:slideshow>
      <!-- <iframe
        class="website-preview"
        sandbox="allow-scripts allow-same-origin"
        :src="websitePreview"
      /> -->

      <div class="website-overlay" />
    </template>

    <p v-if="error" class="signup-error">
      {{ $t(`onboarding:signup:error_${error}`) }}
    </p>

    <el-form
      class="signup-form"
      ref="signupForm"
      :model="account"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
    >
      <el-form-item prop="website" :label="$t('onboarding:signup:website')">
        <el-input type="text" v-model="account.website">
          <template v-slot:prepend>http(s)://</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="firstName" :label="$t('onboarding:signup:firstName')">
        <el-input type="text" v-model="account.firstName" />
      </el-form-item>

      <el-form-item prop="lastName" :label="$t('onboarding:signup:lastName')">
        <el-input type="text" v-model="account.lastName" />
      </el-form-item>

      <el-form-item prop="email" :label="$t('onboarding:signup:email')">
        <el-input type="text" v-model="account.email" />
      </el-form-item>

      <el-form-item prop="password">
        <template v-slot:label>
          {{ $t("onboarding:signup:password") }}
          <span class="hint">
            {{
              $t("no weird rules, make it long enough. random words are good")
            }}
          </span>
        </template>

        <el-input type="password" show-password v-model="account.password" />
      </el-form-item>

      <el-collapse-transition>
        <password-strength
          v-show="account.password"
          class="password-strength"
          :password="account.password"
        />
      </el-collapse-transition>
    </el-form>

    <template v-slot:actions>
      <dc-button
        type="primary"
        @click="submitForm"
        :disabled="loading || !filled"
      >
        {{ $t("onboarding:signup:submit") }}
      </dc-button>
    </template>
  </onboarding-step>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions } from "vuex";

import DcButton from "@/components/DcButton.vue";
import PasswordStrength from "@/components/auth/PasswordStrength.vue";
import OnboardingStep from "@/components/onboarding/OnboardingStep.vue";

import { signUp, verifyWebsite } from "@/api/backend.js";

export default {
  name: "OnboardingSignup",
  components: {
    DcButton,
    PasswordStrength,
    OnboardingStep,
  },
  data() {
    return {
      error: null,
      websitePreview: "about:blank",
      account: {
        website: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      rules: {
        website: [
          {
            required: true,
            message: this.$t("please enter your website address"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              verifyWebsite(value)
                .then(() => {
                  if (value.startsWith("http")) {
                    this.websitePreview = value;
                  } else {
                    this.websitePreview = `http://${value}`;
                  }
                  callback();
                })
                .catch(() =>
                  callback(
                    new Error(this.$t("please enter a valid website address"))
                  )
                );
            },
            trigger: "blur",
          },
        ],
        firstName: [
          {
            required: true,
            message: this.$t("please enter your first name"),
            trigger: "blur",
          },
        ],
        lastName: [
          {
            required: true,
            message: this.$t("please enter your last name"),
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: this.$t("please enter your email"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (/\S+@\S+\.\S+/.test(value)) {
                callback();
              } else {
                callback(new Error(this.$t("please enter a valid email")));
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("please enter a password"),
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  computed: {
    filled() {
      return Object.values(this.account).every(Boolean);
    },
  },
  methods: {
    ...mapActions(["getContext", "setAccessToken"]),
    async handleSignup(data) {
      await this.setAccessToken({ token: data.token, auth_provider: "auth0" });
      await this.getContext();
      this.$router.push({ name: "intro", params: this.$route.params });
    },
    async submitForm() {
      this.loading = true;

      try {
        if (await this.$refs.signupForm.validate()) {
          const res = await signUp({
            ...this.account,
            type: this.$route.params.platform,
          });
          this.handleSignup(res.data);
          // this.$emit("done", res.data);
        }
      } catch (err) {
        if (err && err.response && err.response.data) {
          this.error = err.response.data.code || null;
        } else {
          Sentry.captureException(err);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "~sass/datacue/_colors.scss";

.website-preview {
  width: 200%;
  height: 200%;
  border: none;
  transform-origin: top left;
  transform: scale(0.5);
}

.website-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/datacue-logo-dark.svg") no-repeat center / 80%
    #fff;
  transition: opacity 0.25s ease-in-out;
  opacity: 1;
}

.signup-error {
  margin: 1em 0;
  padding: 1em 1.5em;
  border-left: 1px solid #ad7775;
  background: #f9eded;
}

.signup-form {
  max-width: 600px;
  margin: 1em 0;

  ::v-deep .el-form-item {
    margin-bottom: 2em;
  }
}

.hint {
  display: block;
  line-height: 1.5;
  font-size: 14px;
  color: $gray;
}

.password-strength {
  margin-top: -0.5em;
}
</style>
