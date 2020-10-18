<template>
  <card>
    <template v-slot:header>
      <h4 v-if="$slots.title || title" class="card-title">
        <slot name="title">
          {{ title }}
        </slot>
      </h4>
      <p class="card-category">
        <slot name="subTitle">
          {{ subTitle }}
        </slot>
      </p>
    </template>
    <div>
      <div class="chart">
        <apex-chart
          :options="options"
          :series="series"
          :type="type"
          :height="350"
          :width="'100%'"
        ></apex-chart>
      </div>
      <div class="footer">
        <div class="chart-legend">
          <slot name="legend"></slot>
        </div>
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
import ApexChart from "../ApexCharts.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "chart-card",
  components: {
    Card,
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
    options: {
      type: Object
    },
    type: {
      type: String
    },
    series: {
      type: Array,
      required: true,
      default: () => []
    }
  }
});
</script>
<style></style>
