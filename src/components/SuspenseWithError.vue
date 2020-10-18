<template>
  <slot v-if="error" name="error"></slot>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <slot name="fallback"></slot>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { ref, onErrorCaptured, defineComponent, Ref } from "vue";

export default defineComponent({
  name: "SuspenseWithError",
  setup() {
    const error: Ref<string> | Ref<null> = ref(null);

    onErrorCaptured(e => {
      (error as any).value = `${e}`;

      return true;
    });

    return { error };
  }
});
</script>
