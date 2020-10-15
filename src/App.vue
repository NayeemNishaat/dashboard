<template>
  <div :class="{ 'nav-open': $sidebar.state.showSidebar }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
