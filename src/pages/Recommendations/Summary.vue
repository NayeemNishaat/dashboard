<template>
  <div>
    <template v-if="error || !segments.summary">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <chart-card
            title="Segment Overview"
            sub-title="A quick breakdown of your major customer segments in the last 6 months"
            type="bubble"
            @chart-click="handleSegmentChartClick"
            :data="segmentChart"
            :options="{
              tooltips: {
                enabled: true,
                mode: 'nearest',
                callbacks: {
                  label: function(tooltipItem, data) {
                    return `${tooltipItem.dataset.label}\nrevenue: $${
                      tooltipItem.dataset.data[0].y
                    }, customers: ${
                      tooltipItem.dataset.data[0].x
                    }, rev/customer: ${Math.ceil(
                      tooltipItem.dataset.data[0].y /
                        tooltipItem.dataset.data[0].x
                    )}`;
                  }
                }
              },
              scales: {
                yAxes: {
                  id: 'rev',
                  type: 'linear',
                  scaleLabel: {
                    display: true,
                    labelString: 'revenue'
                  },
                  ticks: {
                    callback: function(value, index, values) {
                      return '$' + new Intl.NumberFormat().format(value);
                    }
                  }
                },
                xAxes: {
                  id: 'customers',
                  type: 'linear',
                  scaleLabel: {
                    display: true,
                    labelString: '# of customers'
                  }
                }
              }
            }"
            :height="100"
          >
            <template v-slot:footer>
              <strong>Guide</strong>
              <ul>
                <li>
                  Size of bubble is the revenue per customer (larger is better)
                </li>
                <li>
                  Segment bubbles on the top right denote high revenue AND large
                  number of customers in the segment.
                </li>
              </ul>
            </template>
          </chart-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card
            title="Acquisition Segments"
            sub-title="Find more people like your most valuable customers with lookalike audiences."
          >
            <dc-table
              :colnames="['cluster_id', 'customers', 'rev_per_customer']"
              :friendly-col-names="[
                'Segment',
                '# of customers',
                'Revenue per Customer'
              ]"
              :data="segments.acquisition"
              :action-button="{
                type: 'primary',
                icon: 'ti-download',
                label: 'audience'
              }"
            />
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card
            title="Retargeting Segments"
            sub-title="Build audiences based on their last visit"
          >
            <div class="row d-flex justify-content-start">
              <div class="lmargin p-tag p-tag-rounded p-tag-success">
                coming soon
              </div>
            </div>
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card
            title="Retention Segments"
            sub-title="Identify customers that haven't bought from you in a while to encourage them to revisit."
          >
            <dc-table
              :colnames="['cluster_id', 'customers', 'rev_per_customer']"
              :friendly-col-names="[
                'Segment',
                '# of customers',
                'Revenue per Customer'
              ]"
              :data="segments.retention"
              :action-button="{
                type: 'primary',
                icon: 'ti-download',
                label: 'audience'
              }"
            />
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DcTable from "@/components/UI/DcTable.vue";
import { defineComponent, reactive, Ref, ref } from "vue";
import { getApi } from "@/api";
import { segmentRecommendations } from "@/api/interfaces";
import { bubbleChartData } from "@/components/Charts/basecharts";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Segments",
  components: {
    DcTable
  },
  async setup() {
    const error = ref(null);
    const router = useRouter();
    let segments: Ref<segmentRecommendations> = ref({
      summary: [],
      acquisition: [],
      retention: []
    });
    const segmentChart: bubbleChartData = reactive({
      datasets: []
    });
    const handleSegmentChartClick = (payload: unknown) => {
      const datasetIdx = payload && (payload as any).datasetIndex;
      if (datasetIdx === null || segments.value.summary.length < datasetIdx) {
        return;
      }
      const label = segments.value.summary[datasetIdx].label;
      router.push(`/segments/${label}`);
    };

    try {
      const api = getApi();
      segments.value = await api.getSegments();

      segmentChart.datasets = segments.value.summary.map(series => {
        return {
          label: series.label,
          data: [{ x: series.x, y: series.y, r: series.r }]
        };
      });
    } catch (err) {
      console.log("error occurred", err);
      error.value = err;
      return {
        segments: null,
        error
      };
    }
    return {
      segments,
      segmentChart,
      handleSegmentChartClick,
      error
    };
  }
});
</script>
<style scoped>
.table-col {
  padding-right: 1rem;
}
.lmargin {
  margin-left: 1rem;
}
</style>
