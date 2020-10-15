<template>
  <div class="content">
    <div class="container-fluid">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <loader-dots />
            </template>
          </Suspense>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
  /* .fade-leave-active in <2.1.8 */

 {
  opacity: 0;
}
</style>
