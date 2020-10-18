import Button from "./Button.vue";

import Card from "./Cards/Card.vue";
import StatsCard from "./Cards/StatsCard.vue";
import ChartCard from "./Cards/ChartCard.vue";
import LoaderDots from "./LoaderDots.vue";
import ErrorMsg from "./ErrorMsg.vue";
import SuspenseWithError from "./SuspenseWithError.vue";

import SidebarPlugin from "./SidebarPlugin/index";
const components = {
  Card,
  ChartCard,
  StatsCard,
  SidebarPlugin,
  LoaderDots,
  ErrorMsg,
  SuspenseWithError
};

export default components;

export {
  Card,
  ChartCard,
  StatsCard,
  Button,
  SidebarPlugin,
  LoaderDots,
  ErrorMsg,
  SuspenseWithError
};
