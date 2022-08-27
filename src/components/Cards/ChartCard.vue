<template>
  <card>
    <template v-if="$slots.title || title">
      <slot name="header">
        <h3 v-if="$slots.title || title" class="card-title">
          <slot name="title">{{ $t(title) }}</slot>
        </h3>
        <p class="card-category">
          <slot name="subTitle">{{ subTitle }}</slot>
        </p>
      </slot>
      <template v-if="$slots.metrics">
        <slot name="metrics"></slot>
      </template>
    </template>
    <template v-else>
      <template v-if="$slots.metrics" slot="header">
        <slot name="metrics"></slot>
      </template>
    </template>
    <div class="chart-contents">
      <div class="row" v-if="loading">
        <div class="col-12">
          <loader-dots></loader-dots>
        </div>
      </div>
      <div class="row" v-else-if="noData">
        <div class="col-2 icon-warning icon-big text-center align-self-center">
          <i :class="noDataIcon"></i>
        </div>
        <div class="col-10 align-self-center chart-nodata">
          <p>{{ $t(noDataText) }}</p>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <line-chart v-if="chartType === 'Line'" :chart-data="chartData" :options="chartOptions" :height="chartHeight">
          </line-chart>
          <doughnut-chart v-else-if="chartType === 'Doughnut'" :chart-data="chartData" :options="chartOptions"
            :height="chartHeight"></doughnut-chart>
          <bar-chart v-else-if="chartType === 'Bar'" :chart-data="chartData" :options="chartOptions"
            :height="chartHeight"></bar-chart>
        </div>
      </div>
      <div class="footer" v-if="$slots.footer">
        <hr />
        <div class="stats">
          <slot name="footer"></slot>
        </div>
        <div class="pull-right"></div>
      </div>
    </div>
  </card>
</template>
<script>
import Card from "./Card.vue";
import DoughnutChart from "@/components/Charts/DoughnutChart.js";
import LineChart from "@/components/Charts/LineChart.js";
import BarChart from "@/components/Charts/BarChart.js";
import LoaderDots from "@/components/LoaderDots.vue";

export default {
  name: "chart-card",
  components: {
    Card,
    LineChart,
    DoughnutChart,
    BarChart,
    LoaderDots,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    footerText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    noData: {
      type: Boolean,
      default: false,
    },
    noDataText: {
      type: String,
      default: "no data",
    },
    noDataIcon: {
      type: String,
      default: "ti-alert",
    },
    chartType: {
      type: String,
      default: "Line", // Line | Doughnut
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
        };
      },
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          series: [],
        };
      },
    },
    chartHeight: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      chartId: "no-id",
    };
  },
};
</script>
<style>
div.card-body>.el-tabs--border-card {
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

div.chart-nodata>p {
  margin-left: 5px;
}
</style>
