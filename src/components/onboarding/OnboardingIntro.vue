<template>
  <onboarding-step
    :title="$t('onboarding:welcome', { name: client.user_name })"
  >
    <template v-slot:slideshow>
      <transition name="fade">
        <figure
          key="banners"
          class="feature feature-banners"
          v-if="selectedFeature === 'banners'"
        >
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

        <figure
          key="products"
          class="feature feature-products"
          v-else-if="selectedFeature === 'products'"
        >
          <div class="example-page">
            <img alt="" src="@/assets/img/sign-up/slideshow/product.jpg" />
            <img alt="" src="@/assets/img/sign-up/slideshow/product-recs.jpg" />
          </div>

          <div class="example-page">
            <img alt="" src="@/assets/img/sign-up/slideshow/cart.jpg" />
            <img alt="" src="@/assets/img/sign-up/slideshow/cart-recs.jpg" />
          </div>
        </figure>

        <figure
          key="notifications"
          class="feature feature-notifications"
          v-else-if="selectedFeature === 'notifications'"
        >
          <img
            alt=""
            src="@/assets/img/sign-up/slideshow/notification-page.jpg"
          />
          <img
            alt=""
            src="@/assets/img/sign-up/slideshow/notification-widget.jpg"
          />
        </figure>
      </transition>
    </template>

    <div v-html="$t('onboarding:intro')" />

    <ul class="feature-list">
      <li
        v-for="feature in features"
        :key="feature.id"
        class="feature-list-item"
        :class="{ active: feature.id === selectedFeature }"
      >
        <button class="feature-toggle" @click="selectedFeature = feature.id">
          <i :class="feature.icon" />
          <span class="feature-name">{{ $t(`product:${feature.id}`) }}</span>
        </button>

        <el-collapse-transition>
          <p
            class="feature-description"
            v-show="feature.id === selectedFeature"
          >
            {{ $t(`onboarding:featureDescription:${feature.id}`) }}
          </p>
        </el-collapse-transition>
      </li>
    </ul>

    <template v-slot:actions>
      <div class="stack">
        <dc-button type="primary" @click="$emit('done')">
          {{ $t("onboarding:startButton") }}
        </dc-button>

        <p class="annotation">
          {{ $t("onboarding:startAnnotation") }}
        </p>
      </div>
    </template>
  </onboarding-step>
</template>

<script>
import { mapGetters } from "vuex";

import DcButton from "@/components/DcButton.vue";
import OnboardingStep from "@/components/onboarding/OnboardingStep.vue";

export default {
  name: "OnboardingIntro",
  components: {
    DcButton,
    OnboardingStep
  },
  data() {
    return {
      features: [
        { id: "banners", icon: "ti-image" },
        { id: "products", icon: "ti-shopping-cart" },
        { id: "notifications", icon: "ti-bell" }
      ],
      selectedFeature: "banners"
    };
  },
  computed: {
    ...mapGetters(["client"])
  }
};
</script>

<style scoped lang="scss">
@import "~sass/datacue/_colors.scss";

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

.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.25s;
}

.expand-leave-active,
.expand-enter-active {
  transition: height 0.25s;
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
  background: url("~@/assets/img/sign-up/slideshow/store-header.jpg") top / 100%
      no-repeat,
    url("~@/assets/img/sign-up/slideshow/store-content.jpg") bottom / 100%
      no-repeat #f2f2f2;
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
          animation: fade-in-75 6s ease-in-out backwards alternate infinite;
          animation-delay: ($j - 2) * 3s + $i * 0.1s;
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
  background: url("~@/assets/img/sign-up/slideshow/store-header.jpg") top / 100%
    no-repeat #f2f2f2;

  &:first-child {
    animation: scroll-down 6s ease-in-out backwards alternate infinite;
  }

  &:last-child img + img {
    animation-delay: 6.5s;
  }

  img {
    width: 100%;

    + img {
      animation: slide-in-small 0.25s ease-out backwards;
      animation-delay: 0.5s;
    }
  }
}

.feature-notifications {
  background: #f2f2f2;

  img:first-child {
    width: 100%;
    animation: gray-out 3s ease-in-out backwards alternate infinite;
  }

  img:last-child {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28.5%;
    animation: fade-in-50 3s ease-in-out backwards alternate infinite;
  }
}

.feature-list {
  margin: 1.5em 0;
  border: 1px solid #e0e0e0;
  padding: 2em 3em;
  box-shadow: 3px 3px 8px fade-out($gray, 0.8);
}

.feature-list-item {
  list-style-type: none;

  & + & {
    margin-top: 1em;
  }
}

.feature-toggle {
  margin-bottom: 1em;
  border: none;
  padding: 0;
  background: transparent;
  font-size: 16px;
  text-align: left;
  color: $gray-dark;

  .active & {
    color: $dark;
  }

  // higher specificity to override `.onboarding p`
  + .feature-description {
    margin: 0 0 0 calc(16px + 1.5em);
    border-left: 1px solid $primary;
    padding-left: 1em;
    font-size: 14px;
  }
}

.feature-name {
  margin-left: 1.5em;
  border-bottom: 1px dashed;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1q;

  .active & {
    border-bottom-color: transparent;
    font-weight: 700;
    letter-spacing: 1px;
  }
}

.stack {
  display: inline-flex;
  flex-flow: column nowrap;
  align-items: center;

  .annotation {
    margin: 0.5em 0;
    font-size: 14px;
    color: $gray;
  }
}
</style>
