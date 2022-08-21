<template>
  <dc-button
    type="primary"
    @click="$emit('click')"
    :disabled="disabled"
    :loading="loading"
  >
    {{ $t("next") }}
    <arrow-right-icon></arrow-right-icon>
  </dc-button>
</template>
<script>
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import DcButton from "@/components/DcButton";

export default {
  components: {
    DcButton
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ArrowRightIcon
  }
};
</script>

<style lang="scss" scoped>
@import "~sass/datacue/_colors.scss";

.btn-next {
  padding: 0 20px 0 50px;
  margin: 35px 0 40px 0;

  svg {
    width: 30px;
    margin-left: 5px;
  }
}
</style>
