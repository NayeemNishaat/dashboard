import { defineComponent, h } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "DoughnutChart",
  components: { Doughnut },
  // props: {
  //   chartId: {
  //     type: String,
  //     default: "bar-chart"
  //   },
  //   width: {
  //     type: Number,
  //     default: 400
  //   },
  //   height: {
  //     type: Number,
  //     default: 400
  //   },
  //   cssClasses: {
  //     default: "",
  //     type: String
  //   }
  // },
  setup(props) {
    return () =>
      h(Doughnut, {
        chartData: props.chartData,
        chartOptions: props.chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      });
  }
});
