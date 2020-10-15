<template>
  <div>
    <template v-if="error || !summary">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-md-4 col-sm-6" v-for="stat in statTypes" :key="stat">
          <stats-card
            :title="stats[stat].title"
            :value="summary.stats[stat]"
            :icon="stats[stat].icon"
          >
          </stats-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card>
            <DataView :value="summary.opportunities" layout="list">
              <template #header>
                <DataViewLayoutOptions v-model="layout"></DataViewLayoutOptions>
              </template>
              <template #list="slotProps">
                <div>
                  <b>{{ slotProps.data.title }}</b>
                  <b>{{ slotProps.data.description }}</b>
                </div>
              </template>
              <template #grid="slotProps">
                <div>
                  <b>{{ slotProps.data.title }}</b>
                </div>
              </template>
            </DataView>
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { StatsCard } from "@/components/index";
import ChartCard from "@/components/Cards/ChartCard.vue";
import DataView from "primevue/dataview";
import { defineComponent, inject, reactive, ref } from "vue";
import { apiSymbol } from "@/api";
import { datacueApi, summary } from "@/api/interfaces";
export default defineComponent({
  name: "Summary",
  components: {
    StatsCard,
    DataView
  },
  async setup() {
    const error = ref(null);
    let summary: summary | undefined = undefined;
    const stats = {
      segments: { title: "# of segments", icon: "ti-image" },
      max_aov: { title: "AOV of most valuable segment", icon: "ti-image" },
      max_size: { title: "Size of largest segment", icon: "ti-image" }
    };
    const statTypes = ["segments", "max_aov", "max_size"];
    try {
      const api: datacueApi | undefined = inject(apiSymbol);
      if (!api) {
        throw new Error("could not load data");
      }
      summary = await api.getSummary("blah-blah-blah");
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        summary: null,
        stats,
        statTypes,
        error
      };
    }
    summary = reactive(summary);
    return {
      summary,
      stats,
      statTypes,
      error
    };
  }
});
</script>
<style></style>
