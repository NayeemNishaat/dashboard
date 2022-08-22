<template>
  <onboarding-step
    :title="$t('onboarding:setup:title')"
    show-back-button
    @back="$emit('back')"
  >
    <template v-slot:slideshow>
      <el-carousel class="carousel" height="100%" arrow="never">
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:home')"
              src="@/assets/img/sign-up/slideshow/home.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:home") }}</p>
              <ul>
                <li v-for="feature in features['home']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:category')"
              src="@/assets/img/sign-up/slideshow/category.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:category") }}</p>
              <ul>
                <li v-for="feature in features['category']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:product')"
              src="@/assets/img/sign-up/slideshow/product.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:product") }}</p>
              <ul>
                <li v-for="feature in features['product']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:cart')"
              src="@/assets/img/sign-up/slideshow/cart.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:cart") }}</p>
              <ul>
                <li v-for="feature in features['cart']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:search')"
              src="@/assets/img/sign-up/slideshow/search.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:search") }}</p>
              <ul>
                <li v-for="feature in features['search']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="page-features">
            <img
              :alt="$t('page:404')"
              src="@/assets/img/sign-up/slideshow/404.svg"
            />
            <div class="feature-list">
              <p>{{ $t("page:404") }}</p>
              <ul>
                <li v-for="feature in features['404']" :key="feature">
                  <i class="ti-check" />
                  {{ $t(`onboarding:feature:${feature}`) }}
                </li>
              </ul>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>

    <div v-html="$t('onboarding:setup:intro')" />

    <ul class="pages">
      <li v-for="page in pages" :key="page">
        <i class="ti-arrow-right" />
        {{ $t(`page:${page}`) }}
      </li>
    </ul>

    <p>{{ $t("onboarding:setup:adjust") }}</p>

    <template v-slot:actions>
      <dc-button type="primary" @click="$emit('done')">
        {{ $t("onboarding:proceedButton") }}
      </dc-button>
    </template>
  </onboarding-step>
</template>

<script>
import DcButton from "@/components/DcButton.vue";
import OnboardingStep from "@/components/onboarding/OnboardingStep.vue";

export default {
  name: "OnboardingSetupShopify",
  components: {
    DcButton,
    OnboardingStep,
  },
  data() {
    return {
      features: {
        home: [
          "banners",
          "categories",
          "recent",
          "userRelated",
          "notificationWidget",
        ],
        category: ["recent", "top", "notificationWidget"],
        product: ["related", "similar", "recent", "notificationWidget"],
        cart: ["recent", "userRelated", "notificationWidget"],
        search: ["recent", "userRelated", "notificationWidget"],
        404: ["recent", "userRelated", "notificationWidget"],
      },
    };
  },
  computed: {
    pages() {
      return Object.keys(this.features);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";

.carousel {
  height: 100%;
}

.el-carousel ::v-deep .el-carousel__indicators {
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }

  .el-carousel__button {
    width: 1em;
    background-color: $gray-light;
  }

  .el-carousel__indicator.is-active button {
    background-color: $primary;
  }
}

.page-features {
  position: relative;
  height: 100%;
  background-color: #efefef;

  @media (min-width: 540px) {
    display: flex;
    flex-flow: row nowrap;
  }

  > img {
    width: 100%;
    height: 100%;

    @media (min-width: 540px) {
      flex: 1 0 50%;
      min-width: 0;
    }
  }

  .feature-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 20%;
    background-color: fade-out(#fff, 0.25);

    @media (min-width: 400px) {
      padding-top: 0.5em;
    }

    @media (min-width: 480px) {
      padding-top: 1em;
    }

    @media (min-width: 540px) {
      position: static;
      flex: 1 0 200px;
      width: auto;
      padding-left: 1em;
      background-color: #fff;
    }

    @media (min-width: 1024px) {
      padding-left: 1.5em;
    }

    p {
      margin: 0.5em 0;
      text-transform: uppercase;
      font-weight: 600;
      color: $dark;
    }

    ul {
      padding: 0;
      list-style-type: none;
      font-size: 12px;

      @media (min-width: 360px) {
        font-size: 14px;
      }

      @media (min-width: 480px) {
        line-height: 2;
      }

      i {
        margin-right: 0.5em;
      }
    }
  }
}

.pages {
  line-height: 2;
  list-style-type: none;

  i {
    margin-right: 0.5em;
  }
}
</style>
