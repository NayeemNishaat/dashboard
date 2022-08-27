<template>
  <div class="row">
    <div class="col-12 d-xl-none progress-container">
      <progress-bar :value="progress" />
    </div>
    <div class="col-12">
      <h3>{{ title }}</h3>
    </div>

    <div class="d-none d-xl-block col-12 progress-container">
      <progress-bar :value="progress" />
    </div>
  </div>
</template>
<script>
import ProgressBar from "@/components/onboarding/ProgressBar.vue";

export default {
  props: {
    title: {
      type: String
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  components: {
    ProgressBar
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

h3 {
  color: $dark;
  font-size: 24px;
  line-height: 1.2;
  padding-bottom: 5px;

  @media (min-width: 768px) {
    padding-bottom: 10px;
    margin: 25px 0 30px 0;
    font-size: 32px;
  }

  @media (max-width: 1199px) {
    border-bottom: $gray-light 1px solid;
  }

  @media (min-width: 1200px) {
    font-size: 36px;
  }

  &.finished {
    border-bottom: $gray-light 1px solid;
  }
}

.progress-container {
  @media (min-width: 992px) {
    margin-top: 5px;
  }

  @media (min-width: 1200px) {
    margin-top: 0;
  }
}
</style>
