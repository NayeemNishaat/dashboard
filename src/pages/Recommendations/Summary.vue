<template>
  <div>
    <template v-if="error || !segments">
      <error-msg />
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12">
          <chart-card
            title="Segment Overview"
            sub-title="A quick breakdown of your major customer segments in the last 6 months"
            type="bubble"
            @chart-click="getElement"
            :data="segmentChart"
            :options="{
              tooltips: {
                enabled: true,
                mode: 'nearest',
                callbacks: {
                  label: function(tooltipItem, data) {
                    return `revenue: $${
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
          <card title="Acquisition Segments (?)" sub-title="Description Text">
            <dc-table
              :colnames="['Name', 'AOV', 'Size', 'Lifecycle']"
              :data="segments"
              linkcol="link"
            />
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card title="Retargeting Segments" sub-title="Description Text">
            <dc-table
              :colnames="['Name', 'AOV', 'Size', 'Lifecycle']"
              :data="segments"
              linkcol="link"
            />
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card title="Retention Segments" sub-title="Description Text">
            <dc-table
              :colnames="['Name', 'AOV', 'Size', 'Lifecycle']"
              :data="segments"
              linkcol="link"
            />
          </card>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import DcTable from "@/components/UI/DcTable.vue";
import { defineComponent, reactive, ref } from "vue";
import { getApi } from "@/api";
import { segments } from "@/api/interfaces";
import { bubbleChartData } from "@/components/Charts/basecharts";
interface segmentsTable extends segments {
  link: string;
}
export default defineComponent({
  name: "Segments",
  components: {
    DcTable
  },
  async setup() {
    const error = ref(null);
    let segments: Array<segmentsTable> | undefined = undefined;
    const segmentChart: bubbleChartData = reactive({
      datasets: []
    });
    const getElement = (payload: unknown) => {
      console.log(payload);
    };

    try {
      const api = getApi();
      segments = (await api.getSegments()) as Array<segmentsTable>;
      segments = segments.map(elem => {
        elem.link = `/segments/${elem.name}`;
        return elem;
      });
      const chartVals = [
        {
          r: 214.5346928327645051,
          x: 1758,
          y: 377151.99,
          label: "accessories"
        },
        {
          r: 315.3901918976545842,
          x: 938,
          y: 295836.0,
          label: "cleaning equipments and cartridges"
        },
        {
          r: 142.7149005772931366,
          x: 1559,
          y: 222492.53,
          label: "cartridge and accessories"
        },
        {
          r: 131.9045610425240055,
          x: 1458,
          y: 192316.85,
          label: "cleaning equipments"
        },
        {
          r: 142.1656730769230769,
          x: 1144,
          y: 162637.53,
          label: "chlorinator and pumps"
        }
      ];
      segmentChart.datasets = chartVals.map(series => {
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
    segments = reactive(segments);

    return {
      segments,
      segmentChart,
      getElement,
      error
    };
  }
});
</script>
<style scoped>
.table-col {
  padding-right: 1rem;
}
</style>
