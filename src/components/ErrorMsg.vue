<template>
  <MessageBanner icon="ti-alert" type="error">
    Oops... an error occurred. Try refreshing?
    <dc-button @click="reload">Refresh</dc-button>
  </MessageBanner>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import MessageBanner from "./MessageBanner.vue";

export default defineComponent({
  name: "error-msg",
  components: { MessageBanner },
  setup() {
    const router = useRouter();
    const reload = () => {
      router.go(0);
    };
    return {
      reload
    };
  }
});
</script>
