<template>
  <MessageBanner
    icon="ti-icon"
    type="error"
    message="Oops... an error occurred. We're looking into it. Could you try again later please?"
  ></MessageBanner>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MessageBanner from "./MessageBanner.vue";

export default defineComponent({
  name: "error-msg",
  components: { MessageBanner }
});
</script>
