<template>
  <div class="wrapper">
    <side-bar>
      <template v-slot:links>
        <sidebar-link to="/overview" name="Overview" icon="ti-info" />
        <sidebar-link
          to="/campaigns"
          name="Campaigns"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/recommendations/summary"
          name="Recommendations"
          icon="ti-check"
        />
        <sidebar-link to="/reports" name="Reports" icon="ti-image" />
      </template>
      <options-menu>
        <sidebar-link
          to="/billing"
          name="Billing"
          icon="nc-icon nc-credit-card"
        />
        <sidebar-link
          to="/settings"
          name="Settings"
          icon="nc-icon nc-settings"
        />
      </options-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script lang="ts">
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import OptionsMenu from "./OptionsMenu.vue";
import { defineComponent } from "vue";
import { getSidebar } from "@/components/SidebarPlugin/state";

export default defineComponent({
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    OptionsMenu
  },
  setup() {
    const sidebar = getSidebar();
    const toggleSidebar = () => {
      if (sidebar.state.showSidebar) {
        sidebar.displaySidebar(false);
      }
    };
    return { toggleSidebar };
  }
});
</script>
