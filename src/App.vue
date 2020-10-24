<template>
  <div :class="{ 'nav-open': sidebar.state.showSidebar }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getSidebar } from "./components/SidebarPlugin/state";

export default defineComponent({
  setup() {
    const sidebar = getSidebar();
    return { sidebar };
  }
});
</script>
