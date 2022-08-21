<template>
  <div class="onboarding-step-container">
    <div class="onboarding-step">
      <div class="onboarding-step-title">
        <h1>{{ title }}</h1>

        <dc-button
          type="text"
          class="onboarding-step-back"
          v-if="showBackButton"
          @click="$emit('back')"
        >
          &laquo; Back
        </dc-button>
      </div>

      <div class="onboarding-step-slideshow">
        <div class="slideshow-browser-window">
          <div class="slideshow-browser-bar" />
          <div class="slideshow-viewport">
            <slot name="slideshow" />
          </div>
        </div>
      </div>

      <div class="onboarding-step-content">
        <slot />

        <div v-if="$slots.actions" class="onboarding-step-actions">
          <slot name="actions" />
        </div>

        <div v-if="$slots.tip" class="onboarding-step-tip">
          <i class="ti-light-bulb" />
          <p class="tip-contents">
            <slot name="tip" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DcButton from "@/components/DcButton.vue";

export default {
  name: "OnboardingStep",
  components: {
    DcButton
  },
  props: {
    title: {
      type: String,
      required: true
    },
    showBackButton: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
@import "~sass/datacue/_colors.scss";

// anchoring the slideshow to the container instead of its immediate parent
// prevents it from scrolling with overflow in desktop view
.onboarding-step-container {
  position: relative;
  height: 100%;

  ::v-deep {
    .v-modal {
      background: white;
      opacity: 0.75;
    }

    .el-dialog {
      border-radius: 8px;
      box-shadow: 3px 3px 8px 5px fade-out($gray, 0.8);

      .el-form-item__label {
        line-height: 1.5;
        font-size: 16px;
      }

      .el-select {
        display: block;
      }
    }

    .el-dialog__headerbtn {
      line-height: 1em;
      border: 1px solid $primary;
      border-radius: 4px;
      padding: 0.25em;
      font-size: 24px;
      color: $primary;

      .el-dialog__close {
        color: inherit;
      }
    }

    .el-dialog__header {
      padding: 80px 100px 0;

      > h2 {
        margin-bottom: 40px;
      }
    }

    .el-dialog__body {
      padding: 0 100px;
      color: $dark;
    }

    .el-dialog__footer {
      padding: 20px 100px 80px;
      color: $gray-dark;
    }
  }
}

.onboarding-step {
  display: flex;
  flex-flow: column nowrap;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 80px);

  @media (min-width: 1024px) {
    padding-top: 2%;
    padding-right: 50%;
  }

  > * {
    flex: 0 0 auto;
  }
}

.onboarding-step-title {
  position: relative;
  margin: 2em 12.5% 1em;
}

.onboarding-step-back {
  position: absolute;
  top: -1.5em;
}

.onboarding-step-content {
  position: relative;
  flex-grow: 1;
  // bottom margin works when `.onboarding-step` is not overflowing
  margin: 0 12.5% 3em;
  padding-bottom: 3em;
}

.onboarding-step-actions {
  margin-top: 3em;

  > * {
    margin-bottom: 1em;

    &:not(:last-child) {
      margin-right: 1em;
    }
  }
}

.onboarding-step-tip {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  margin-top: 3em;
  border-top: 1px solid $primary;
  padding-top: 1em;
  color: $gray-dark;

  > i {
    font-size: 20px;
    color: $primary;
  }

  .tip-contents {
    margin: 0 0 0 1em;
    font-size: 14px;
  }
}

.onboarding-step-slideshow {
  margin: 0 0 1.5em;
  padding: 6.25% 12.5%;
  background: url("~@/assets/img/sign-up/slideshow/waves.svg") center / cover,
    #fdd367;

  @media (min-width: 1024px) {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    width: 50vw;
    max-width: 110vh;
    margin: 0;
    padding: 40px;
    // move the slideshow behind the parent's scrollbar
    z-index: -1;
  }
}

.slideshow-browser-window {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 0;
  border-radius: 8px;
  padding: 24px 0 56.25%;
  background: white;
  box-shadow: 3px 3px 8px fade-out($gray, 0.8);
}

.slideshow-browser-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  background: radial-gradient(circle at 18px, #ff6058 4px, #0000 5px),
    radial-gradient(circle at 33px, #ffbc2d 4px, #0000 5px),
    radial-gradient(circle at 48px, #27c940 4px, #0000 5px), #353439;
  z-index: 2;
}

.slideshow-viewport {
  position: absolute;
  top: 24px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
