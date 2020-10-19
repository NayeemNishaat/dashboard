import { datacueApi } from "./api/http";

declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module "chartjs-chart-treemap";
