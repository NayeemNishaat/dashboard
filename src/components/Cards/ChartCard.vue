<template>
  <card>
    <template v-slot:header>
      <h3 v-if="$slots.title || title" class="card-title">
        <slot name="title">{{ $t(title) }}</slot>
      </h3>
      <p class="card-category">
        <slot name="subTitle">{{ subTitle }}</slot>
      </p>
    </template>
    <template v-if="$slots.metrics">
      <slot name="metrics"></slot>
    </template>
    <div class="chart-contents">
      <div class="row" v-if="noData">
        <div class="col-2 icon-warning icon-big text-center align-self-center">
          <i :class="noDataIcon"></i>
        </div>
        <div class="col-10 align-self-center chart-nodata">
          <p>{{ $t(noDataText) }}</p>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <ApexChart
            v-if="type === 'treemap'"
            :options="options"
            :data="data"
            :type="type"
            :width="chartWidth"
          />
          <Charts
            v-else
            :data="data"
            :type="type"
            :options="options"
            :height="height"
          ></Charts>
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
<script lang="ts">
import Card from "./Card.vue";
import Charts from "@/components/Charts/basecharts";
import ApexChart from "../ApexCharts.vue";
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "chart-card",
  components: {
    Card,
    Charts,
    ApexChart
  },
  props: {
    footerText: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    noData: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: "no data"
    },
    noDataIcon: {
      type: String,
      default: "ti-alert"
    },
    type: {
      type: String,
      default: "line" // "line" | "bar" | "scatter" | "bubble" | "pie" | "doughnut" | "polarArea" | "radar";
    },
    options: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false
        };
      }
    },
    data: {
      type: Object,
      default: () => {
        return {
          labels: [],
          series: []
        };
      }
    },
    height: {
      type: Number,
      default: 300
    },
    width: {
      type: String,
      default: "100%"
    }
  },
  setup(props) {
    const chartWidth = ref("300");
    onMounted(() => {
      //force apex charts to re-render TODO: remove when we have a better solution
      setTimeout(() => {
        chartWidth.value = props.width;
      }, 1000);
    });
    return { chartWidth };
  }
});
</script>
<style>
div.card-body > .el-tabs--border-card {
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
div.chart-nodata > p {
  margin-left: 5px;
}
</style>
