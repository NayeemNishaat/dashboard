<template>
  <div class="onboarding-content">
    <div class="row">
      <div class="col-12">
        <div class="intro-panel mx-auto">
          <intro-panel v-if="step === 0" :title="$t('personalized homepages are the future')" :firstPanel="true"
            nextBtnCaption="continue" @next="next" @back="back" @skip="exit">
            <img class="static" src="@/assets/img/onboarding-intro/personalized-homepage.png" />
            <template v-slot:subtitle>
              <div v-html="$t('personalized homepages are the future-description')" />
            </template>
          </intro-panel>
          <intro-panel v-if="step === 1" :title="$t('first time visitors see best sellers')" nextBtnCaption="continue"
            @next="next" @back="back" @skip="exit">
            <img class="static" src="@/assets/img/onboarding-intro/first-time-visitor.png" />
            <template v-slot:subtitle>
              <div v-html="$t('first time visitors see best sellers-description')" />
            </template>
          </intro-panel>
          <intro-panel v-if="step === 2" :title="$t('each click instantly updates predictions')"
            nextBtnCaption="continue" @next="next" @back="back" @skip="exit">
            <img class="static" src="@/assets/img/onboarding-intro/existing-visitors.png" />
            <template v-slot:subtitle>
              <div v-html="
                $t('each click instantly updates predictions-description')
              " />
            </template>
          </intro-panel>
          <intro-panel v-if="step === 3" :title="$t('show different banners for each visitor')"
            nextBtnCaption="continue" :browserWindow="true" @next="next" @back="back" @skip="exit">
            <template v-slot:slideshow>
              <figure key="banners" class="feature feature-banners">
                <div class="example-banner">
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-1.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-1a.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-1b.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-1c.jpg" />
                </div>
                <div class="example-banner">
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-2.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-2a.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-2b.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-2c.jpg" />
                </div>
                <div class="example-banner">
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-3.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-3a.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-3b.jpg" />
                  <img alt="" src="@/assets/img/sign-up/slideshow/banner-3c.jpg" />
                </div>
              </figure>
            </template>
            <template v-slot:subtitle>
              <div v-html="
                $t('show different banners for each visitor-description')
              " />
            </template>
          </intro-panel>
          <intro-panel v-if="step === 4" :title="$t('different products for different folks')" nextBtnCaption="continue"
            :browserWindow="true" @next="next" @back="back" @skip="exit">
            <template v-slot:slideshow>
              <figure key="products" class="feature feature-products">
                <div class="example-page">
                  <img alt="" src="@/assets/img/sign-up/slideshow/product-recs.jpg" />
                </div>

                <div class="example-page">
                  <img alt="" src="@/assets/img/sign-up/slideshow/cart-recs.jpg" />
                </div>
              </figure>
            </template>
            <template v-slot:subtitle>
              <div v-html="
                $t('different products for different folks-description')
              " />
            </template>
          </intro-panel>
          <intro-panel v-if="step === 5" :title="$t('relax, results will keep improving')" nextBtnCaption="store setup"
            :lastPanel="true" @next="next" @back="back" @skip="exit">
            <img class="static" src="@/assets/img/onboarding-intro/view-results.gif" />
            <template v-slot:subtitle>
              <div v-html="$t('relax, results will keep improving-description')" />
            </template>
          </intro-panel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import IntroPanel from "@/components/onboarding/IntroPanel.vue";
export default {
  name: "Intro",
  components: {
    IntroPanel,
  },
  computed: {
    ...mapGetters("onboarding", ["introStep"]),
    step: {
      get() {
        return this.introStep;
      },
      set(value) {
        this.setIntroStep(value);
      },
    },
  },
  methods: {
    ...mapActions("onboarding", ["setIntroStep"]),
    exit() {
      this.$router.push({
        name: "onboarding-setup",
        params: this.$route.params,
      });
    },
    next() {
      const maxSteps = 5;
      if (this.step >= maxSteps) {
        this.exit();
      }
      this.step = this.step + 1;
    },
    back() {
      if (this.step <= 0) {
        this.step = 0;
        return;
      }
      this.step = this.step - 1;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

@keyframes slide-in {
  0% {
    transform: translateY(-30%) scale(1.1);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-small {
  0% {
    transform: translateY(-10%) scale(1.05);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in-50 {

  0%,
  40% {
    opacity: 0;
  }

  60%,
  100% {
    opacity: 1;
  }
}

@keyframes fade-in-75 {

  0%,
  70% {
    opacity: 0;
  }

  80%,
  100% {
    opacity: 1;
  }
}

@keyframes slide-sideways {

  0%,
  45% {
    transform: translateX(0);
  }

  55%,
  100% {
    transform: translateX(-50%);
  }
}

@keyframes scroll-down {

  0%,
  40% {
    transform: translateY(0);
  }

  70%,
  100% {
    transform: translateY(-50%);
  }
}

@keyframes gray-out {

  0%,
  40% {
    filter: grayscale(0);
  }

  60%,
  100% {
    filter: grayscale(100%);
  }
}

.feature {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  margin: 0;
}

.feature-banners {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14% 3% 0;
  background: url("@/assets/img/sign-up/slideshow/store-header.jpg") top / 100% no-repeat,
    url("@/assets/img/sign-up/slideshow/store-content.jpg") bottom / 100% no-repeat #f2f2f2;
}

.example-banner {
  position: relative;
  width: 21%;
  height: 0;
  padding-bottom: 31.5%;
  animation: slide-in 0.25s ease-out backwards;

  @for $i from 1 through 3 {
    &:nth-child(#{$i}) {
      animation-delay: $i * 0.1s;

      @for $j from 2 through 4 {
        img:nth-child(#{$j}) {
          animation: fade-in-75 4s ease-in-out backwards alternate infinite;
          animation-delay: ($j - 2) * 4s + $i * 0.1s;
        }
      }
    }
  }

  &:nth-child(2) {
    width: 52.5%;
  }

  img {
    position: absolute;
    width: 100%;
    left: 0px;
  }
}

.feature-products {
  display: flex;
  flex-flow: row nowrap;
  width: 200%;
  height: 200%;
  animation: slide-sideways 6s ease-in-out backwards alternate infinite;
  animation-delay: 3s;
}

.example-page {
  flex: 0 0 50%;
  min-width: 0;
  padding-top: 6%;
  background: url("@/assets/img/sign-up/slideshow/store-header.jpg") top / 100% no-repeat #f2f2f2;

  &:first-child {
    animation: scroll-down 6s ease-in-out backwards alternate infinite;
  }

  &:last-child img+img {
    animation-delay: 6.5s;
  }

  img {
    width: 100%;

    +img {
      animation: slide-in-small 0.25s ease-out backwards;
      animation-delay: 0.5s;
    }
  }
}

.intro-panel {
  max-width: 720px;
}

header {
  padding: 10px 0px;
  display: flex;
  justify-content: right;
}
</style>
