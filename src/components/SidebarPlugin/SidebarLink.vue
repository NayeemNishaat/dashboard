<template>
  <component
    :is="tag"
    @click="hideSidebar"
    class="nav-item"
    v-bind="$attrs"
    tag="li"
  >
    <a
      :data-id="`sidebar:link-${name}`"
      class="nav-link"
      :class="{ 'nav-disabled-link': disabled }"
    >
      <slot>
        <i v-if="icon" :class="icon"></i>
        <p :class="{ greyed: disabled }">
          {{ translatedName || $tc(name, 2) }}
        </p>
      </slot>
    </a>
  </component>
</template>
<script>
export default {
  name: "sidebar-link",
  inheritAttrs: false,
  inject: {
    autoClose: {
      default: true
    },
    addLink: {
      default: () => {}
    },
    removeLink: {
      default: () => {}
    }
  },
  props: {
    name: String,
    translatedName: String,
    icon: String,
    tag: {
      type: String,
      default: "router-link"
    },
    disabled: {
      type: Boolean,
      default: false
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
  beforeDestroy() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  }
};
</script>
<style>
.wrapper .sidebar .nav .nav-item:hover > .nav-link.nav-disabled-link {
  opacity: 0.5;
}
.wrapper .sidebar .nav .nav-item > .nav-link.nav-disabled-link {
  opacity: 0.5;
}
</style>
