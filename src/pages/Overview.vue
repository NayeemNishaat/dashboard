<template>
  <div>
    <template v-if="error || !(overview && overview.stats)">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-md-4 col-sm-6" v-for="stat in statTypes" :key="stat">
          <stats-card
            :title="stats[stat].title"
            :value="new Intl.NumberFormat().format(overview.stats[stat])"
            :icon="stats[stat].icon"
            tag="coming soon"
          >
          </stats-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card title="Recommended campaigns">
            <p
              v-if="
                overview.opportunities && overview.opportunities.length === 0
              "
            >
              No Recommendations yet (Coming soon!)
            </p>
            <DataView v-else :value="overview.opportunities" layout="list">
              <template #list="slotProps">
                <div class="rec-row">
                  <div>
                    <b>{{ slotProps.data.title }}</b>
                  </div>
                  <span>{{ slotProps.data.description }}</span>
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
import ChartCard from "@/components/Cards/ChartCard.vue";
import DataView from "primevue/dataview";
import { defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { overview } from "@/api/interfaces";
export default defineComponent({
  name: "Summary",
  components: {
    DataView
  },
  async setup() {
    const error = ref(null);
    let overview: overview | undefined = undefined;
    const stats = {
      dc_revenue: { title: "Revenue", icon: "ti-money" },
      ad_spend: { title: "Ad Spend", icon: "ti-wallet" },
      roi: { title: "Return on Investment", icon: "ti-bar-chart" }
    };
    const statTypes = ["dc_revenue", "ad_spend", "roi"];
    try {
      const api = getApi();
      overview = await api.getOverview();
    } catch (err) {
      error.value = err;
      return {
        summary: null,
        stats,
        statTypes,
        error
      };
    }
    overview = reactive(overview);
    return {
      overview,
      stats,
      statTypes,
      error
    };
  }
});
</script>
<style scoped>
.rec-row {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
