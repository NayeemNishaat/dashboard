<template>
  <div class="onboarding">
    <div class="row d-md-none">
      <div class="col-12 top-picker mx-auto">
        <lang-picker-mobile
          :selected-locale="selectedLocale"
          @select="locale => (selectedLocale = locale)"
        ></lang-picker-mobile>

        <div v-if="isLoggedIn" class="btn-logout">
          <a @click="logout">{{ $t("logout") }}</a>
        </div>
      </div>
    </div>
    <div class="row main-container">
      <div
        class="d-none d-lg-block left-container col-12 col-lg-4 justify-content-center align-content-center"
      >
        <div class="row logo-container">
          <div class="col d-flex align-content-center justify-content-center">
            <img alt src="@/assets/img/datacue-logo-dark.svg" />
          </div>
        </div>
      </div>
      <div class="right-container col-12 col-lg-8 mx-auto">
        <div class="row d-none d-md-block lang-picker-container">
          <div class="d-flex col justify-content-between">
            <lang-picker
              :selected-locale="selectedLocale"
              @select="locale => (selectedLocale = locale)"
            ></lang-picker>

            <div v-if="isLoggedIn" class="btn-logout">
              <a @click="logout">{{ $t("logout") }}</a>
            </div>
          </div>
        </div>

        <router-view></router-view>

        <div class="container footer text-center">
          &copy; {{ new Date().getFullYear() }} DataCue
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LangPicker from "@/components/LangPicker";
import LangPickerMobile from "@/components/LangPickerMobile";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    LangPicker,
    LangPickerMobile
  },
  data() {
    return {
      selectedLocale: {}
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"])
  },
  methods: {
    ...mapActions(["logout"])
  }
};
</script>

<style lang="scss" scoped>
@import "~sass/datacue/_colors.scss";

.onboarding {
  min-height: 100vh;

  .main-container {
    min-height: 100vh;
  }
}

.onboarding > .row {
  margin: 0;
}

.btn-logout {
  color: $primary;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
}

.top-picker {
  .btn-logout {
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 800;
    line-height: 1;
  }
}

.lang-picker-container::v-deep {
  margin-top: 30px;
  font-size: 14px;

  .lang-picker {
    span {
      font-size: 14px;
    }
  }
}

.footer {
  margin-bottom: 20px;
  color: $gray-light;
  font-size: 14px;
}

.right-container {
  position: relative;
  padding-bottom: 60px;

  .footer {
    position: absolute !important;
    bottom: 0;
    left: 0;
  }
}

@media (max-width: 575px) {
  .top-picker,
  .right-container {
    max-width: 350px;
  }
}

@media (min-width: 576px) {
  .top-picker,
  .right-container {
    min-width: 380px;
    flex: 0 0 60%;
  }
}

@media (min-width: 768px) {
  .top-picker,
  .right-container {
    min-width: 490px;
    flex: 0 0 60%;
  }
}

@media (min-width: 992px) {
  .left-container {
    flex: 0 0 36%;
    max-width: 36%;
    background: url("../../assets/img/sign-up/left-container-background.svg")
      no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    .logo-container {
      height: 100%;
      img {
        width: 70%;
      }
    }
  }
  .top-picker,
  .right-container {
    flex: 0 0 64%;
    max-width: 550px;
  }
}

@media (min-width: 1200px) {
  .top-picker,
  .right-container {
    max-width: 550px;
  }

  .form-container {
    max-width: 370px !important;
  }
}
</style>
