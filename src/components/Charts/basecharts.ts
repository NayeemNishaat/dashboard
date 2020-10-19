import {
  Arc,
  Chart,
  LineController as chLineController,
  BarController as chBar,
  Line as chLine,
  Point as chPoint,
  DoughnutController,
  LinearScale as chLinearScale,
  CategoryScale as chCategoryScale,
  Title as chTitle,
  Tooltip as chTooltip,
  Filler as chFiller,
  Legend as chLegend,
  Rectangle
} from "chart.js";
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";

Chart.register(
  Arc,
  chLineController,
  chBar,
  chLine,
  chPoint,
  chLinearScale,
  chCategoryScale,
  Rectangle,
  DoughnutController,
  chTitle,
  chTooltip,
  chFiller,
  chLegend
);

import { defineComponent } from "vue";

// export function generateChart(chartId: string, chartType: any) {
export default defineComponent({
  setup(props, { slots, attrs, emit }) {
    const chart = ref<Chart | null>(null);
    const canvas = ref<any | null>(null);
    const chartId = computed(
      () => `chart-${(Math.random() * 1e32).toString(36)}`
    );
    const renderChart = () => {
      if (chart.value) chart.value.destroy();
      if (!canvas.value)
        throw new Error(
          "Please remove the <template></template> tags from your chart component. See https://vue-chartjs.org/guide/#vue-single-file-components"
        );
      chart.value = new Chart(canvas.value.getContext("2d"), {
        type: props.type as chartType,
        data: props.data as any,
        options: props.options
      });
    };
    const destroy = () => {
      if (chart.value) {
        chart.value.destroy();
        chart.value = null;
      }
    };
    const refresh = () => {
      destroy();
      renderChart();
    };

    onMounted(() => {
      renderChart();
    });

    onBeforeUnmount(() => {
      destroy();
    });
    return () =>
      h(
        "div",
        {
          style: props.styles,
          class: props.cssClasses
        },
        [
          h("canvas", {
            id: chartId.value,
            width: props.width,
            height: props.height,
            ref: canvas
          })
        ]
      );
  },
  props: {
    type: {
      default: "line",
      type: String
    },
    data: {
      type: Object
    },
    options: {
      type: Object
    },
    width: {
      default: 400,
      type: Number
    },
    height: {
      default: 400,
      type: Number
    },
    cssClasses: {
      type: String,
      default: ""
    },
    styles: {
      type: Object
    }
  }
});

type chartType =
  | "line"
  | "bar"
  | "scatter"
  | "bubble"
  | "pie"
  | "doughnut"
  | "polarArea"
  | "radar";
