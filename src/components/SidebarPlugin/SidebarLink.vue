<template>
  <li>
    <router-link ref="el" v-bind="$attrs">
      <slot>
        <i v-if="icon" :class="icon"></i>
        <p>{{ name }}</p>
      </slot>
    </router-link>
  </li>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "sidebar-link",
  inheritAttrs: false,
  emits: {
    "hide-sidebar": null
  },
  inject: {
    sidebar: {
      default: {}
    },
    state: {
      default: true
    },
    autoClose: {
      default: true
    },
    addLink: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    },
    removeLink: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    }
  },
  props: {
    name: String,
    icon: String,
    tag: {
      type: String,
      default: "router-link"
    }
  },
  methods: {
    hideSidebar() {
      if ((this as any).autoClose) {
        (this as any).sidebar.displaySidebar(false);
      }
    },
    isActive() {
      const to = (this as any).$refs?.el?.to ?? "";
      return this.$route.path.startsWith(to);
    }
  },
  mounted() {
    if ((this as any).addLink) {
      (this as any).addLink(this);
    }
  },
  beforeUnmount() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if ((this as any).removeLink) {
      (this as any).removeLink(this);
    }
  }
});
</script>
<style></style>
