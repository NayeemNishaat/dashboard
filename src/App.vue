<template>
  <div :class="{ 'nav-open': $sidebar.state.showSidebar }">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
