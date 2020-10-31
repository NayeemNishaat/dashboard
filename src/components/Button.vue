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
      :class="[small ? 'small' : '', type]"
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
    small: {
      type: Boolean,
      default: false
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
