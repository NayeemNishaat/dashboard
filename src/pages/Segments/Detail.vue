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
            <p>{{ segment }}</p>
          </card>
          <chart-card
            type="treemap"
            :series="rfmMap.series"
            :options="rfmMap.options"
          ></chart-card>
          <p>{{ rfmMap }}</p>
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
    const error = ref(null);
    const segmentName = computed(() => {
      const segment = useRoute()?.params?.segment ?? "";
      if (Array.isArray(segment)) {
        return segment[0];
      }
      return segment;
    });
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
    segment = reactive(segment);
    const rfmMap = reactive({
      series: [
        {
          data: Object.keys(segment.rfm).map(key => {
            return { x: key, y: (segment as any).rfm[key] };
          })
        }
      ],
      options: {
        legend: {
          show: false
        },
        chart: {
          height: 350,
          type: "treemap"
        },
        title: {
          text: "Basic Treemap"
        }
      }
    });

    return {
      segment,
      segmentName,
      error,
      rfmMap
    };
  }
});
</script>
<style></style>
