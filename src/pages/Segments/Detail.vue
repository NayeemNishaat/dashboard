<template>
  <div>
    <template v-if="error || !segment">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <router-link :to="'/segments'">back</router-link>
          <card :title="segmentName">
            <p>Lets learn all about this segment</p>
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DataView from "primevue/dataview";
import { computed, defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { segment } from "@/api/interfaces";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "Segments",
  components: {},
  async setup() {
    console.log("loading segment detail");
    const segmentName = computed(() => {
      const segment = useRoute()?.params?.segment ?? "";
      if (Array.isArray(segment)) {
        return segment[0];
      }
      return segment;
    });
    const error = ref(null);
    let segment: segment | undefined = undefined;
    try {
      const api = getApi();
      segment = await api.getSegment("blah-blah-blah", "12312");
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        segmentName,
        segment: null,
        error
      };
    }
    console.log("got segment", segment);
    segment = reactive(segment);
    return {
      segment,
      segmentName,
      error
    };
  }
});
</script>
<style></style>
