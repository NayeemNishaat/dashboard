<template>
  <nav class="dc-steps">
    <ul class="dc-step-list">
      <slot />
    </ul>
  </nav>
</template>

<script>
export default {
  name: "DcSteps"
};
</script>

<style scoped lang="scss">
.dc-step-list {
  display: flex;
  flex-flow: row nowrap;
  margin: 0;
  padding: 0 0 2em;
  font-size: 14px;
}
</style>
