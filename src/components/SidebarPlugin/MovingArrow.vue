<template>
  <div class="moving-arrow" :style="arrowStyle"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    moveY: {
      type: Number,
      default: 0
    },
    hide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Styles to animate the arrow
     * @returns {{transform: string}}
     */
    arrowStyle() {
      return {
        transform: `translate3d(0px, ${(this as any).moveY}px, 0px)`,
        display: (this as any).hide ? "none" : "inline-block"
      };
    }
  }
});
</script>
<style lang="scss">
$bg-nude: #f4f3ef !default;

.moving-arrow {
  border-right: 17px solid $bg-nude;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  display: inline-block;
  position: absolute;
  left: 243px;
  top: 30px;
  transition: all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1);
}
@media (max-width: 992px) {
  .moving-arrow {
    display: none;
  }
}
</style>
