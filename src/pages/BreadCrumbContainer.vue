<template>
  <div>
    <div class="row">
      <div class="col-12">
        <router-link
          v-if="routeName === 'segment-details'"
          :to="'/segments/all'"
          >back</router-link
        >
        <Suspense>
          <template #default>
            <router-view></router-view>
          </template>
          <template #fallback>
            <loading />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Breadcrumb from "primevue/breadcrumb";
import { computed, defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const home = { icon: "ti-home", to: "/segments" };
    const path = computed(() => {
      if (!(route?.fullPath ?? null)) {
        return [];
      }
      if ((route?.fullPath?.split("/").length ?? 0) < 3) {
        return [];
      }
      const paths = route?.fullPath?.split("/") ?? [];
      return paths.slice(1, paths.length).map(elem => {
        return { label: elem, to: `/segments/${elem}` };
      });
    });
    return {
      home,
      path,
      routeName: route.name
    };
  },
  components: {
    // Breadcrumb
  }
});
</script>
