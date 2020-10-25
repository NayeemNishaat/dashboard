<template>
  <div>
    <card><h1>Settings</h1></card>
    <p>{{ user }}</p>
  </div>
</template>
<script lang="ts">
import { getAuth } from "@/auth";
import { defineComponent, onMounted, ref, Ref } from "vue";
export default defineComponent({
  setup() {
    const user: Ref<null> | Ref<any> = ref(null);
    onMounted(async () => {
      const auth = await getAuth();
      user.value = auth.state.user;
    });
    return { user };
  }
});
</script>
<style></style>
