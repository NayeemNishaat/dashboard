import {
  ArcElement,
  Chart,
  LineController,
  BarController,
  BubbleController,
  LineElement,
  PointElement,
  DoughnutController,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";

export interface bubbleChartData {
  datasets: Array<bubbleChartDataSet>;
}

interface bubbleChartDataSet {
  label: string;
  data: Array<{ x: number; y: number; r: number }>;
}
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";

Chart.register(
  ArcElement,
  LineController,
  BarController,
  BubbleController,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  DoughnutController,
  Title,
  Tooltip,
  Filler,
  Legend
);

import { defineComponent } from "vue";

const chartColors = [
  "rgba(250,184,0,0.4)",
  "rgba(255,144,0,0.4)",
  "rgba(255,91,41,0.4)",
  "rgba(255,0,78,0.4)",
  "rgba(220,0,138,0.4)",
  "rgba(191,0,184,0.4)",
  "rgba(141,0,212,0.4)",
  "rgba(41,10,255,0.4)"
];

const getChartColor = (idx: number, alpha: string) =>
  chartColors[idx].replace("0.4", alpha);

const normalizeBubbleRatios = (data: bubbleChartData) => {
  const MAX_RATIO_SIZE = 20;
  const numbers = [] as Array<number>;
  data.datasets.forEach(elem => {
    elem.data.forEach(point => {
      numbers.push(point.r);
    });
  });
  const max = numbers.reduce((a, b) => Math.max(a, b));
  const ratio = MAX_RATIO_SIZE / max;
  return {
    datasets: data.datasets.map((elem, idx) => {
      return {
        label: elem.label,
        backgroundColor: getChartColor(idx, "0.5"),
        borderColor: getChartColor(idx, "0.8"),
        hoverBackgroundColor: getChartColor(idx, "0.7"),
        hoverBorderColor: getChartColor(idx, "1"),
        borderWidth: 2,
        hoverBorderWidth: 3,
        data: elem.data.map(item => {
          return {
            r: Math.ceil(item.r * ratio),
            x: item.x,
            y: item.y
          };
        })
      };
    })
  };
};
// export function generateChart(chartId: string, chartType: any) {
export default defineComponent({
  emits: ["chart-click"],
  setup(props, { emit }) {
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
      let data = props.data;
      if (props.type === "bubble") {
        data = normalizeBubbleRatios(data as bubbleChartData);
      }
      chart.value = new Chart(canvas.value.getContext("2d"), {
        type: props.type as chartType,
        data: data as any,
        options: props.options
      });
      chart.value.options.onClick = handleClick(chart.value);
    };
    const destroy = () => {
      if (chart.value) {
        chart.value.destroy();
        chart.value = null;
      }
    };
    const handleClick = (chart: Chart) => {
      return (evt: any) => {
        const elements = chart.getElementsAtEventForMode(
          evt,
          "nearest",
          { intersect: true },
          false
        );
        try {
          if (elements && elements.length > 0) {
            emit("chart-click", elements[0]);
          }
          // eslint-disable-next-line no-empty
        } catch {}
      };
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
