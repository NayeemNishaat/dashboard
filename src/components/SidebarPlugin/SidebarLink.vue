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
<script>
export default {
  name: "sidebar-link",
  inheritAttrs: false,
  emits: {
    "hide-sidebar": null
  },
  inject: {
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
      if (this.autoClose) {
        this.$sidebar.displaySidebar(false);
      }
    },
    isActive() {
      const to = this.$refs?.el?.to ?? "";
      return this.$route.path.startsWith(to);
    }
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
  },
  beforeUnmount() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  }
};
</script>
<style></style>
