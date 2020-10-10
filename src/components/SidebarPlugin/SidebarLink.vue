<template>
  <router-link ref="el" class="nav-item" v-bind="$attrs">
    <a class="nav-link">
      <slot>
        <i v-if="icon" :class="icon"></i>
        <p>{{ name }}</p>
      </slot>
    </a>
  </router-link>
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
      return this.$el.classList.contains("active");
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
