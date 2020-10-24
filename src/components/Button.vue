<template>
  <div class="button-container">
    <a
      v-if="tag === 'a'"
      :href="href"
      target="_blank"
      type="button"
      class="dc-button"
      :class="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <loading v-if="loading" />
      <slot v-else />
    </a>
    <button
      v-else
      type="button"
      class="dc-button"
      :class="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <loading v-if="loading" />
      <slot v-else />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DcButton",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "outline",
      validator: function(value: string) {
        // The value must match one of these strings
        return ["primary", "outline", "link", "circle"].indexOf(value) !== -1;
      }
    },
    tag: {
      type: String,
      default: "button"
    },

    href: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
});
</script>

<style scoped lang="scss">
@import "../assets/sass/datacue/_colors.scss";

.dc-button {
  border: none;
  padding: 0;
  margin-right: 0.5em;
  font-family: inherit;
  font-size: 14px;
  color: inherit;
  background: #0000;

  &:disabled,
  &:disabled:hover {
    background: $bg-disabled !important;
    border: 1px solid $gray-light !important;
    color: $gray;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    -webkit-transform: none;
    -ms-transform: none;
  }

  &:hover {
    box-shadow: 0 6px 10px 0 rgba(191, 139, 7, 0.15);
    -webkit-transform: translate(0, -1px);
    -ms-transform: translate(0, -1px);
    transform: translate(0, -1px);
  }
}

.primary,
.outline {
  min-width: 12em;
  border-radius: 100vw;
  padding: 0.75em 1.5em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  -webkit-appearance: none;
}

.circle {
  height: 3em;
  width: 3em;
  border-radius: 50%;
  overflow: hidden;
}

.primary:hover {
  color: white;
}
.primary {
  color: $dark;
  background: $primary;
}

.outline,
.circle {
  background-color: white;
  color: $gray;
  border: 1px solid $gray-light;
}

.outline:hover,
.circle:hover {
  border-color: #fdb809;
  color: #fdb809;
}

.text {
  text-transform: uppercase;
  color: $gray;
}

.link {
  display: inline;
  text-decoration: underline;

  &:hover,
  &:focus {
    color: $primary;
  }
}
</style>
