<template>
  <div class="onboarding-content">
    <div class="row">
      <div class="col-12">
        <div class="mx-auto">
          <setup-panel v-show="step === 0" nextBtnCaption="continue" @back="back" @next="next" @skip="exit">
            <banner-settings :onboarding="true" />
          </setup-panel>
          <setup-panel v-show="step === 1" nextBtnCaption="continue" @back="back" @next="next" @skip="exit">
            <product-settings ref="productSettings" :onboarding="true" />
          </setup-panel>
          <setup-panel v-if="step === 2 && $route.params.platform === 'shopify'" nextBtnCaption="continue" @back="back"
            @next="next" @skip="exit">
            <card>
              <template v-slot:header>
                <h3>{{ $t("onboarding:setup:title") }}</h3>
              </template>
              <div v-html="$t('onboarding:setup:intro')" />
              <ul class="pages">
                <li v-for="page in pages" :key="page">
                  <i class="ti-arrow-right" />
                  {{ $t(`page:${page}`) }}
                </li>
              </ul>

              <p>{{ $t("onboarding:setup:adjust") }}</p>
            </card>
          </setup-panel>
          <setup-panel v-else-if="step === 2 && $route.params.platform !== 'shopify'" nextBtnCaption="continue"
            @back="back" @next="next" @skip="exit">
            <onboarding-setup-plugin-installation />
          </setup-panel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import SetupPanel from "@/components/onboarding/SetupPanel.vue";
import OnboardingSetupPluginInstallation from "@/components/onboarding/OnboardingSetupPluginInstallation.vue";
import BannerSettings from "@/pages/Settings/Banner.vue";
import ProductSettings from "@/pages/Settings/Product.vue";
export default {
  name: "Setup",
  components: {
    SetupPanel,
    BannerSettings,
    ProductSettings,
    OnboardingSetupPluginInstallation
  },
  data() {
    return {
      pages: ["home", "category", "product", "cart", "search", "404"]
    };
  },
  computed: {
    ...mapGetters("onboarding", ["setupStep"]),
    step: {
      get() {
        return this.setupStep;
      },
      set(value) {
        this.setSetupStep(value);
      }
    }
  },
  methods: {
    ...mapActions("onboarding", ["setSetupStep"]),
    exit() {
      this.$router.push({
        name: "onboarding-billing",
        params: this.$route.params
      });
    },
    async next() {
      const maxSteps = 2;
      if (this.step >= maxSteps) {
        await this.$refs.productSettings.saveChanges();
        this.exit();
      }
      this.step = this.step + 1;
    },
    back() {
      if (this.step <= 0) {
        this.$router.push({
          name: "onboarding-intro",
          params: this.$route.params
        });
      }
      this.step = this.step - 1;
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.setup-panel-container {
  min-width: 960px;
  max-width: 1024px;
}

header {
  padding: 10px 0px;
  display: flex;
  justify-content: right;
}

.pages {
  line-height: 2;
  list-style-type: none;

  i {
    margin-right: 0.5em;
  }
}
</style>
