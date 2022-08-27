<template>
  <el-form label-position="top" :model="signUpForm" :rules="rules" ref="signUpForm">
    <dc-alert v-show="errorMessage" class="mb-3" :message="errorMessage" />

    <div class="row">
      <div class="col-12">
        <el-form-item class="is-no-asterisk" :label="$t('website address')" prop="website">
          <el-input v-model="signUpForm.website"></el-input>
        </el-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <el-form-item class="is-no-asterisk" :label="$t('first name')" prop="firstName">
          <el-input v-model="signUpForm.firstName"></el-input>
        </el-form-item>
      </div>
      <div class="col-12">
        <el-form-item class="is-no-asterisk" :label="$t('last name')" prop="lastName">
          <el-input v-model="signUpForm.lastName"></el-input>
        </el-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <el-form-item class="is-no-asterisk" :label="$t('email')" prop="email">
          <el-input v-model="signUpForm.email" type="email"></el-input>
        </el-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div>
          <password-toggle :password-hidden="passwordHidden" @click="passwordHidden = !passwordHidden" />
        </div>
        <el-form-item class="is-no-asterisk" :label="$t('password')" prop="password">
          <el-input v-model="signUpForm.password" :type="passwordHidden ? 'password' : 'text'"></el-input>
        </el-form-item>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12 px-0">
        <div v-show="signUpForm.password" class="col-12 password-strength text-right float-right">
          <password-strength :password="signUpForm.password" />
        </div>
        <div class="col-12 password-rules float-left">
          {{
              $t("no weird rules, make it long enough. random words are good")
          }}.
        </div>
      </div>
    </div>

    <el-form-item :label="$t('email')" prop="username" style="display: none">
      <el-input v-model="signUpForm.username" :placeholder="$t('please leave this field blank')"></el-input>
    </el-form-item>

    <div class="row">
      <div class="col-12 text-center text-lg-left">
        <btn-next @click="submit" :disabled="disableSubmit" :loading="loading"></btn-next>
      </div>
    </div>
  </el-form>
</template>

<script>
import * as Sentry from "@sentry/browser";
import { mapActions } from "vuex";

import { signUp, verifyWebsite } from "@/api/backend.js";
import BtnNext from "@/components/onboarding/BtnNext.vue";
import DcAlert from "@/components/DcAlert.vue";
import PasswordStrength from "@/components/auth/PasswordStrength.vue";
import PasswordToggle from "@/components/auth/PasswordToggle.vue";
export default {
  props: {
    platform: {
      type: String,
      default: "custom"
    }
  },
  components: {
    BtnNext,
    DcAlert,
    PasswordStrength,
    PasswordToggle
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!this.validateEmail()) {
        callback(new Error(this.$t("please enter a valid email")));
      }
      callback();
    };
    const validateWebsite = (rule, value, callback) => {
      this.errors = {};
      this.errorCode = "";
      this.invalidWebsite = false;
      verifyWebsite(value)
        .then(() => {
          callback();
        })
        .catch(() => {
          this.invalidWebsite = true;
          callback(new Error(this.$t("please enter a valid website address")));
        });
    };
    return {
      loading: false,
      errors: {},
      errorCode: "",
      passwordHidden: true,
      signUpForm: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        website: "https://"
      },
      invalidWebsite: false,
      rules: {
        firstName: [
          {
            required: true,
            message: this.$t("please enter your first name"),
            trigger: "blur"
          }
        ],
        lastName: [
          {
            required: true,
            message: this.$t("please enter your last name"),
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("please enter your email"),
            trigger: "blur"
          },
          { validator: validateEmail, trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: this.$t("please enter a password"),
            trigger: "blur"
          }
        ],
        website: [
          {
            required: true,
            message: this.$t("please enter your website address"),
            trigger: "blur"
          },
          { validator: validateWebsite, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    disableSubmit() {
      if (this.loading) {
        return true;
      }
      for (const key of Object.keys(this.signUpForm)) {
        if (key !== "username" && !this.signUpForm[key]) {
          return true;
        }
      }
      if (this.invalidWebsite) {
        return true;
      }
      return false;
    },
    errorMessage() {
      if (this.errorCode == "apikey_exists") {
        return this.$t("website already exists");
      } else if (this.errorCode == "email_exists") {
        return this.$t("email already exists");
      } else if (this.errorCode == "unreachable") {
        return this.$t("website is unreachable");
      } else {
        return this.errors.message;
      }
    }
  },
  methods: {
    ...mapActions(["getContext", "setAccessToken"]),
    validateEmail() {
      const re = /\S+@\S+\.\S+/;
      return re.test(this.signUpForm.email);
    },
    setErrors(error) {
      if (error && error.response) {
        if (error.response.status == 500) {
          this.errors.message = this.$t(
            "an unknown error occured, please try again later"
          );
        } else {
          const data = error.response.data;
          if (data) {
            this.errorCode = data.code;
            this.errors = data;
          }
        }
      }
    },
    submit() {
      this.errors = {};
      this.errorCode = "";
      this.$refs["signUpForm"].validate((valid) => {
        if (valid && !this.signUpForm.username) {
          this.loading = true;
          this.$set(this.signUpForm, "type", this.platform);
          signUp(this.signUpForm)
            .then((response) => {
              this.setAccessToken({
                token: response.data.token,
                auth_provider: "auth0"
              }).then(() => {
                this.getContext().then(() => {
                  this.$emit("submit", response.data);
                });
              });
            })
            .catch((error) => {
              Sentry.captureException(error);
              this.setErrors(error);
            })
            .finally(() => {
              this.loading = false;
              return;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
