<template>
  <div
    class="sidebar"
    data-background-color="darkblue"
    data-active-color="warning"
  >
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <router-link to="/" class="simple-text">
          <div class="logo-img">
            <img src="@/assets/img/datacue-logo.svg" alt />
          </div>
        </router-link>
      </div>
      <slot> </slot>
      <ul class="nav">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot name="links">
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="index"
            :to="link.path"
            :name="link.name"
            :icon="link.icon"
          >
          </sidebar-link>
        </slot>
      </ul>
      <moving-arrow :move-y="arrowMovePx"> </moving-arrow>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import MovingArrow from "./MovingArrow.vue";
import SidebarLink from "./SidebarLink.vue";
export default defineComponent({
  components: {
    SidebarLink,
    MovingArrow
  },
  props: {
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose,
      addLink: this.addLink,
      removeLink: this.removeLink
    };
  },
  computed: {
    /**
     * Styles to animate the arrow near the current active sidebar link
     * @returns {{transform: string}}
     */
    arrowMovePx() {
      return this.linkHeight * this.activeLinkIndex;
    }
  },
  data() {
    return {
      linkHeight: 65,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      links: []
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
      const slotLinks = this.$slots.links().map(elem => elem.props.name);
      const index = slotLinks.indexOf(link.name);
      // console.log(JSON.stringify(slotLinks));
      // console.log("link", JSON.stringify(link));
      this.links.splice(index, 0, link);
    },
    removeLink(link) {
      const index = this.links.indexOf(link);
      if (index > -1) {
        this.links.splice(index, 1);
      }
    }
  },
  mounted() {
    this.findActiveLink();
  },
  updated() {
    this.findActiveLink();
  }
});
</script>
<style></style>
