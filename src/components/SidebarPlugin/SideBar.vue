<template>
  <div class="sidebar" data-color="darkblue" data-active-color="warning">
    <div class="logo">
      <router-link to="/" class="simple-text">
        <div class="logo-img">
          <img src="@/assets/img/datacue-logo.svg" alt />
        </div>
      </router-link>
    </div>
    <div class="sidebar-wrapper">
      <ul class="nav">
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
      <moving-arrow :move-y="arrowMovePx" :hide="this.activeLinkIndex > 3">
      </moving-arrow>
      <slot> </slot>
    </div>
  </div>
</template>
<script lang="ts">
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
    arrowMovePx(): number {
      return this.linkHeight * this.activeLinkIndex;
    }
  },
  data() {
    return {
      linkHeight: 60,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      links: [] as Array<any>
    };
  },
  methods: {
    findActiveLink() {
      this.links.forEach((link, index) => {
        if ((link as any).isActive()) {
          this.activeLinkIndex = index;
        }
      });
    },
    addLink(link: any) {
      const slotLinks = (this as any).$slots
        .links()
        .map((elem: any) => elem.props.name);
      const index = slotLinks.indexOf(link.name);
      if (index < 0) {
        this.links.push(link);
        return;
      }
      this.links.splice(index, 0, link);
    },
    removeLink(link: any) {
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
