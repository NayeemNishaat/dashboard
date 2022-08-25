<template>
  <div
    class="sidebar"
    :data-background-color="backgroundColor"
    :data-active-color="activeColor"
  >
    <div class="sidebar-wrapper" id="style-3" data-id="sidebar">
      <div class="logo">
        <router-link to="/" class="simple-text">
          <div class="logo-img">
            <img src="@/assets/img/datacue-logo.svg" alt="logo" />
          </div>
        </router-link>
      </div>
      <ul class="nav">
        <slot></slot>
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot name="links" data-id="sidebar:links">
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="index"
            :to="link.path"
            :name="$tc(link.name, 2)"
            :icon="link.icon"
          >
          </sidebar-link>
        </slot>
      </ul>
      <moving-arrow :move-y="arrowMovePx"></moving-arrow>
    </div>
  </div>
</template>
<script>
import MovingArrow from "./MovingArrow.vue";
import SidebarLink from "./SidebarLink.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "DataCue",
    },
    backgroundColor: {
      type: String,
      default: "darkblue",
      validator: (value) => {
        let acceptedValues = ["white", "black", "darkblue"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    activeColor: {
      type: String,
      default: "warning",
      validator: (value) => {
        let acceptedValues = [
          "primary",
          "info",
          "success",
          "warning",
          "danger",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
      addLink: this.addLink,
      removeLink: this.removeLink,
    };
  },
  components: {
    MovingArrow,
    SidebarLink,
  },
  computed: {
    ...mapGetters(["client"]),
    /**
     * Styles to animate the arrow near the current active sidebar link
     * @returns {{transform: string}}
     */
    arrowMovePx() {
      return this.linkHeight * this.activeLinkIndex;
    },
  },
  data() {
    return {
      linkHeight: 65,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      links: [],
    };
  },
  methods: {
    findActiveLink() {
      this.links.forEach((link, index) => {
        if (link.isActive()) {
          this.activeLinkIndex = index;
        }
      });
    },
    addLink(link) {
      const index = this.$slots.default().indexOf(link.$vnode);
      this.links.splice(index, 0, link);
    },
    removeLink(link) {
      const index = this.links.indexOf(link);
      if (index > -1) {
        this.links.splice(index, 1);
      }
    },
  },
  mounted() {
    this.$watch("$route", this.findActiveLink, {
      immediate: true,
    });
  },
};
</script>
<style></style>
