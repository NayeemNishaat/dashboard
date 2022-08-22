<template>
  <div class="onboarding-panel">
    <section>
      <slot> </slot>
    </section>
    <footer class="row">
      <div class="col-2 d-flex justify-content-center align-content-center">
        <button class="text-btn" @click="$emit('back')">
          <div class="d-flex">
            <i class="ti-angle-left"></i>&nbsp;&nbsp;{{ $t("back") }}
          </div>
        </button>
      </div>
      <div class="col-8 d-flex justify-content-center align-content-center">
        <dc-button type="primary" @click="$emit('next')">
          {{ $t(nextBtnCaption) }}
        </dc-button>
      </div>
      <div class="col-2 d-flex .align-content-center">
        <button class="skip text-btn" @click="$emit('skip')">
          {{ $t("skip") }}
        </button>
      </div>
    </footer>
  </div>
</template>
<script>
import DcButton from "@/components/DcButton.vue";
export default {
  name: "SetupPanel",
  components: {
    DcButton,
  },
  props: {
    title: String,
    lastPanel: {
      type: Boolean,
      default: false,
    },
    nextBtnCaption: {
      type: String,
      default: "continue",
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/datacue/_colors.scss";
header {
  text-align: center;
  padding-bottom: 10px;
}
footer {
  margin-top: 0px;
  padding-top: 0px;
}

button.skip {
  color: $gray-dark;
}

button > div > i {
  margin-top: 3px;
}
</style>
