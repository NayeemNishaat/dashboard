<template>
  <div class="signup-page no-sroll">
    <div class="row d-lg-none">
      <div class="col-12 top-picker mx-auto">
        <lang-picker-mobile
          :selected-locale="selectedLocale"
          @select="(locale) => (selectedLocale = locale)"
        ></lang-picker-mobile>

        <div class="btn-login">
          <router-link :to="{ name: 'login' }">{{ $t("login") }}</router-link>
        </div>
      </div>
    </div>
    <div class="row main-container">
      <div class="left-container col-12 col-lg-6 col-xl-6">
        <div class="row">
          <div class="signup-sidebar col-12">
            <div class="signup-sidebar-content">
              <div class="spacer"></div>
              <div class="logo-container">
                <img
                  class="logo"
                  src="../../assets/img/datacue-logo-dark.svg"
                  alt
                />
              </div>
              <div class="d-none d-lg-flex justify-content-center">
                <img
                  class="supergirl"
                  src="../../assets/img/sign-up/supergirl-layout-4-5.svg"
                  alt
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6 col-xl-6 right-container">
        <div class="d-none d-lg-block row login-row">
          <div class="col-12 text-right">
            {{ $t("already have an account") }}?
            <router-link :to="{ name: 'login' }">{{ $t("login") }}</router-link>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <h3 class="text-center text-lg-left">{{ $t("get started") }}!</h3>
            <p class="description d-none d-lg-block">
              {{ $t("signup:tagLine") }}.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 text-center text-lg-left platform-label">
            {{ $t("what platform do you use") }}?
          </div>

          <div class="col-12">
            <div class="row platforms">
              <div
                v-for="(platform, idx) in platforms"
                :class="platformClass(platform, idx)"
                @click="selectedPlatform = platform"
                :key="idx"
              >
                <img
                  class="tick"
                  alt
                  src="../../assets/img/sign-up/yellow-tick.svg"
                />
                <div class="other" v-if="platform === 'other'">
                  {{ $t("other") }}
                </div>
                <img
                  v-else
                  class="platform"
                  alt
                  :src="getPlatformImg(platform)"
                />
              </div>
            </div>

            <div class="row actions">
              <div class="col-12 col-lg-4 text-center text-lg-left">
                <dc-button
                  type="primary"
                  @click="goToOnboarding"
                  :loading="loading"
                  :disabled="!this.selectedPlatform"
                  >{{ $t("get started") }}!</dc-button
                >
              </div>

              <div
                class="col-12 col-lg-8 text-center text-lg-left terms mx-auto"
              >
                {{
                  $t("by submitting this form, you are agreeing to DataCue's")
                }}
                <a href="https://datacue.co/terms" target="_blank">{{
                  $t("terms")
                }}</a>
              </div>
            </div>

            <div class="row d-none d-lg-block lang-picker-container">
              <div class="col">
                <lang-picker
                  :selected-locale="selectedLocale"
                  @select="(locale) => (selectedLocale = locale)"
                  class="float-right"
                ></lang-picker>
              </div>
            </div>

            <div class="col-12 text-center d-lg-none">
              <img
                class="supergirl-bottom"
                src="../../assets/img/sign-up/supergirl-layout-1-2-3.svg"
                alt
              />
            </div>
          </div>
        </div>

        <div class="container footer text-center">
          &copy; {{ new Date().getFullYear() }} DataCue
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DcButton from "../../components/DcButton.vue";
import LangPicker from "../../components/LangPicker.vue";
import LangPickerMobile from "../../components/LangPickerMobile.vue";

export default {
  name: "login",
  components: {
    DcButton,
    LangPicker,
    LangPickerMobile
  },
  data() {
    return {
      submitted: false,
      loading: false,
      error: false,
      selectedPlatform: "",
      selectedLocale: {},
      platforms: ["shopify", "magento", "woocommerce", "prestashop", "other"]
    };
  },
  methods: {
    platformClass(platform, idx) {
      return {
        left: idx % 2 == 0,
        right: idx % 2 == 1,
        "platform-container": true,
        active: platform === this.selectedPlatform
      };
    },
    getPlatformImg(platform) {
      return require(`../../assets/img/sign-up/platforms/${platform}.png`);
    },
    goToOnboarding() {
      const platform = this.selectedPlatform;
      const name = "onboarding";

      if (platform === "shopify") {
        window.location = import.meta.env.VITE_APP_URL.includes("staging")
          ? import.meta.env.VITE_APP_SHOPIFY_INSTALL_URL
          : "https://apps.shopify.com/datacue";
      } else {
        this.$router.push({ name: name, params: { platform } });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/sass/datacue/_colors.scss";

.signup-page > .row {
  margin: 0px;
}

.signup-sidebar {
  display: flex;
  height: 53vw;
  max-height: 200px;
  padding: 0px;

  @media (max-width: 991px) {
    background: url("../../assets/img/sign-up/yellow-background-layout-1-2-3.svg")
      no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .signup-sidebar-content {
    text-align: center;
    width: 100%;

    .spacer {
      height: 60px;
      max-height: 60px;
    }

    .logo {
      height: 15.5vw;
      max-height: 70px;
    }
  }
}

.signup-page {
  a {
    color: $primary;

    &:hover {
      color: $primary;
      text-decoration: underline;
    }
  }

  .top-picker {
    max-width: 450px;

    .btn-login {
      position: absolute;
      top: 18px;
      right: 15px;
      z-index: 800;
      font-size: 16px;
      line-height: 1;
    }
  }

  h3 {
    color: $dark;
    font-size: 32px;
    line-height: 1;
    margin: 0;
    padding: 40px 0 10px 0;

    @media (max-width: 991px) {
      border-bottom: 1px solid $gray-light;
    }
  }

  .right-container {
    height: 94vh;
    height: 100%;
    width: calc(100vw - 40px);
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;

    .platform-label {
      color: $dark;
      margin: 40px 0 30px 0;
      font-size: 16px;
      line-height: 1;
    }

    .actions {
      margin-top: 30px;
    }

    .btn-submit {
      margin: 0 0 20px 0;
    }

    .terms {
      font-size: 16px;
      color: $gray-dark;
      margin-bottom: 40px;
      max-width: 350px;
    }
  }
}

.platforms {
  display: flex;
  align-items: center;
  justify-content: center;

  .platform-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: $gray-light 1px solid;
    background: $bg-input;
    margin: 0 3vw 20px;

    cursor: pointer;
    width: 200px;
    height: 50px;
    border-radius: 25px;
    background-size: 100px 25px;

    img.tick {
      width: 20px;
      position: absolute;
      left: 20px;
      display: none;
    }

    &.active {
      img.tick {
        display: block;
      }
    }

    img.platform {
      width: 100px;
      -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
      filter: grayscale(100%);
    }

    .other {
      color: $dark;
    }

    &:hover,
    &.active {
      background-color: #fff;
      border: $primary 1px solid;

      img.platform {
        -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
        filter: none;
      }

      .other {
        color: $primary;
      }
    }
  }
}

.supergirl-bottom {
  width: 70vw;
  max-width: 300px;
}

.footer {
  margin-bottom: 20px;
  margin-top: 30px;
  color: $gray-light;
  font-size: 14px;
}

@media (min-width: 576px) {
  .signup-sidebar {
    height: 34vw;
    max-height: 220px;

    .signup-sidebar-content {
      .spacer {
        height: 10.41vw;
        max-height: 70px;
      }

      .logo {
        height: 12vw;
        max-height: 80px;
      }
    }
  }

  .signup-page {
    .right-container {
      width: 80vw;
      max-width: 520px;
    }

    .top-picker {
      max-width: 520px;
    }
  }

  .supergirl-bottom {
    width: 52vw;
    max-width: 300px;
  }
}

@media (min-width: 992px) {
  .main-container {
    background: url("../../assets/img/sign-up/yellow-background-layout-5.svg")
      no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 100vh;
  }

  .login-row {
    height: 80px;
    padding-top: 30px;
    font-size: 16px;

    @media (min-height: 1000px) {
      height: 120px;
      padding-top: 70px;
    }
  }

  .signup-page {
    h3 {
      font-size: 36px;
      padding-bottom: 25px;
    }

    .description {
      font-size: 16px;
      padding-bottom: 15px;
      border-bottom: 1px solid $gray-light;
    }

    .right-container {
      max-width: 450px;

      .platform-label {
        margin-top: 50px;
      }
    }
  }
  .signup-sidebar {
    height: auto;

    .signup-sidebar-content {
      .spacer {
        height: 15vh;
        min-height: 100px;
        max-height: none;
      }

      .logo {
        width: 28vw;
        height: auto;
        max-height: none;
        margin-bottom: 30px;
      }

      .supergirl {
        width: 28vw;
        height: 26vw;
      }
    }
  }

  .right-container {
    .terms {
      padding-left: 45px;
    }

    .terms,
    .btn-submit {
      margin-bottom: 0 !important;
    }

    .actions {
      margin-bottom: 50px;
    }
  }

  .platforms {
    .platform-container {
      margin: 0 10px 30px;
    }
  }

  .footer {
    @media (min-height: 730px) {
      position: absolute;
      bottom: 0;
    }
  }
}

@media (min-width: 1200px) {
  .main-container {
    background: url("../../assets/img/sign-up/yellow-background-layout-5.svg")
      no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .right-container {
    .actions {
      margin-bottom: 60px;

      @media (min-height: 600px) {
        margin-bottom: 10vh;
      }
    }
  }
}
</style>
