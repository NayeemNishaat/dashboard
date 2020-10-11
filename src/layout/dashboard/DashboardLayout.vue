<template>
  <div class="wrapper">
    <side-bar>
      <template v-slot:links>
        <sidebar-link to="/summary" name="Summary" icon="ti-info" />
        <sidebar-link to="/segments" name="Segments" icon="ti-user" />
        <sidebar-link
          to="/campaigns"
          name="Campaigns"
          icon="ti-view-list-alt"
        />
        <sidebar-link to="/creatives" name="Creatives" icon="ti-image" />
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

export default defineComponent({
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    OptionsMenu
  },
  methods: {
    toggleSidebar() {
      if ((this as any).$sidebar.state.showSidebar) {
        (this as any).$sidebar.displaySidebar(false);
      }
    }
  }
});
</script>
