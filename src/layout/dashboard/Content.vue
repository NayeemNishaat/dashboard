<template>
  <div class="content">
    <div class="container-fluid">
      <!-- <router-view></router-view> -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <div v-if="error">
            <error-msg />
          </div>
          <Suspense v-else>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <loading />
            </template>
          </Suspense>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onErrorCaptured, ref } from "vue";

export default defineComponent({
  setup() {
    // const error = ref("");
    // onErrorCaptured(e => {
    //   error.value = `${e}`;
    //   return true;
    // });
    return { error: ref(null) };
  }
});
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
