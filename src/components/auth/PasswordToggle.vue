<template>
  <label class="form-check-label float-right show-password">
    <span @click="$emit('click')">
      <eye-show-icon v-show="passwordHidden"></eye-show-icon>
      <eye-hide-icon v-show="!passwordHidden"></eye-hide-icon>
      {{ passwordHidden ? $t("show password") : $t("hide password") }}
    </span>
  </label>
</template>

<script>
import EyeHideIcon from "/src/components/icons/EyeHideIcon";
import EyeShowIcon from "/src/components/icons/EyeShowIcon";

export default {
  props: {
    passwordHidden: {
      type: Boolean,
      default: true
    }
  },
  components: {
    EyeHideIcon,
    EyeShowIcon
  },
  computed: {
    iconClass() {
      return {
        fa: true,
        "fa-lg": true,
        "fa-eye": this.passwordHidden,
        "fa-eye-slash": !this.passwordHidden
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/src/assets/sass/datacue/_colors.scss";

label.show-password {
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
  color: $gray;
  fill: $gray;

  &:hover {
    fill: $primary;
    color: $primary;
  }

  svg {
    width: 25px;
    height: 13px;
    margin-bottom: 3px;
  }
}
</style>
