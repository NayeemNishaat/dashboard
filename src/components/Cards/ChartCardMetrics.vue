<template>
  <div>
    <chart-card :title="chartTitle" :chart-data="selChartData" :chart-type="chartType" :chart-options="chartOptions"
      :loading="loading">
      <el-tabs v-model="metric" slot="metrics">
        <el-tab-pane :name="curMetric" v-for="curMetric in metrics" :key="curMetric">
          <span slot="label">
            <i :class="metricIcons[curMetric]"></i>
            <span style="padding-left:5px;">{{ $t(curMetric, 2) }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </chart-card>
  </div>
</template>
<script>
import * as Sentry from "@sentry/browser";
import ChartCard from "./ChartCard.vue";
/*
We expects data as an array of objects as follows:
[{'series':'series label','dataset':[{'dts':'date','<metric_1>':0,'<metric_2>':1}]}]
*/
const chartColors = [
  "rgba(248,186,0,1)", //yellow
  "rgba(104,179,200,1)", //blue
  "rgba(190,110,70,1)", //peach
  "rgba(215,38,61,1)", //red
  "rgba(111,208,140,1)" //green
];

export default {
  name: "ChartCardMetrics",
  components: {
    ChartCard
  },
  props: {
    defaultMetric: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      default: () => []
    },
    chartType: {
      type: String,
      default: "Line"
    },
    chartTitle: {
      type: String,
      default: ""
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          legend: { display: true },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          }
        };
      }
    }
  },
  data() {
    return {
      metric: "-",
      metricIcons: {
        customers: "ti-user",
        sales: "ti-money",
        revenue: "ti-money",
        orders: "ti-shopping-cart",
        clicks: "ti-mouse-alt",
        conversions: "ti-shopping-cart",
        ctr: "ti-mouse-alt",
        cvr: "ti-shopping-cart"
      }
    };
  },
  computed: {
    metrics() {
      let newMetrics = [];
      let dataset = {};
      try {
        dataset = this.chartData[0].dataset[0];
      } catch {
        return newMetrics;
      }
      try {
        newMetrics = Object.keys(dataset).filter(e => e !== "dts");
      } catch (err) {
        Sentry.captureException(err);
      }
      return newMetrics;
    },
    selChartData() {
      let newChartData = { labels: [], datasets: [] };
      try {
        const chartData = this.chartData;
        let datasets = chartData.map((elem, idx) => {
          return this.chartType == "Bar"
            ? {
              label: this.$t(elem.series),
              data: elem?.dataset?.map(e => e[this.metric]) ?? [],
              backgroundColor: chartColors[idx % chartColors.length],
              stack: "Stack 0",
              borderColor: chartColors[idx % chartColors.length]
            }
            : {
              value: elem.series,
              label: this.$t(elem.series),
              data: elem?.dataset?.map(e => e[this.metric]) ?? [],
              backgroundColor: `transparent`,
              borderColor: chartColors[idx % chartColors.length]
            };
        });
        try {
          let labels = chartData[0].dataset.map(e => e["dts"]);
          newChartData = { labels, datasets };
        } catch {
          newChartData = { labels: [], datasets };
        }
      } catch (err) {
        Sentry.captureException(err);
      }
      return newChartData;
    }
  },
  methods: {
    setMetric() {
      if (this.metrics.length > 0 && this.metric === "-") {
        if (
          this.defaultMetric !== "" &&
          this.metrics.includes(this.defaultMetric)
        ) {
          this.metric = this.defaultMetric;
        } else {
          this.metric = this.metrics[0];
        }
      }
    }
  },
  mounted() {
    this.setMetric();
  },
  beforeUpdate() {
    this.setMetric();
  }
};
</script>
