<template>
  <label :class="labelClass" for="" @click="copy">
    <tick-circle v-if="copied" />
    <copy-icon v-else />
    {{ copied ? $t("copied") : $t("copy") }}
  </label>
</template>
<script>
import TickCircle from "@/components/icons/TickCircle.vue";
import CopyIcon from "@/components/icons/CopyIcon.vue";

export default {
  components: {
    CopyIcon,
    TickCircle,
  },
  data() {
    return {
      copied: false,
    };
  },
  computed: {
    labelClass() {
      return {
        copy: true,
        copied: this.copied,
      };
    },
  },
  methods: {
    copy() {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 3000);
      this.$emit("copy");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

label.copy {
  cursor: pointer;
  font-size: 1em;
  color: $primary;
  fill: $primary;
  margin: 10px 0 0 0;
  line-height: 1;

  &.copied {
    color: $gray;
    fill: $gray;
  }

  svg {
    height: 20px;
  }
}
</style>
