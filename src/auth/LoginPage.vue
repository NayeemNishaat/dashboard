<template>
  <Suspense>
    <template #default>
      <Login />
    </template>
    <template #fallback>
      <loading />
    </template>
  </Suspense>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Login from "@/auth/Login.vue";
export default defineComponent({
  name: "Login page",
  components: { Login }
});
</script>
