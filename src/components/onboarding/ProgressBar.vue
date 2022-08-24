<template>
  <div class="row step-progress">
    <div class="col-12 progress-container">
      <div class="row">
        <div class="col d-xl-none text-center top-label">{{ title }}</div>
      </div>
      <div class="row">
        <div class="col-xl-10">
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :style="style"
              :aria-valuenow="value"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <div class="col d-none d-xl-block text-right">{{ title }}</div>
      </div>
      <hr class="d-none d-xl-block" />
    </div>
    <div class="spacer col-12 d-none d-xl-block"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    style() {
      return {
        width: `${this.value}%`
      };
    },
    title() {
      let part = this.$t("part");
      if (this.value == 50) {
        return `${part} 1/2`;
      } else if (this.value == 100) {
        return `${part} 2/2`;
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/src/assets/sass/datacue/_colors.scss";

.step-progress {
  .top-label {
    margin-bottom: 10px;
  }
  .progress {
    border-radius: 0.4em;
    height: 10px;
  }
  .progress-bar {
    background: $primary;
  }
  .text-right {
    margin-top: -6px;
  }

  @media (min-width: 1200px) {
    .progress-container {
      padding-bottom: 10px;

      hr {
        border-color: $gray-light;
        margin-top: 10px;
        margin-bottom: 0;
      }
    }

    .spacer {
      min-height: 40px;
      max-height: 60px;
      height: 5vh;
    }
  }
}
</style>
