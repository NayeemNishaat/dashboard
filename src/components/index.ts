import Button from "./Button.vue";

import Card from "./Cards/Card.vue";
import StatsCard from "./Cards/StatsCard.vue";
import LoaderDots from "./LoaderDots.vue";
import ErrorMsg from "./ErrorMsg.vue";

import SidebarPlugin from "./SidebarPlugin/index";
const components = {
  Card,
  StatsCard,
  SidebarPlugin,
  LoaderDots,
  ErrorMsg
};

export default components;

export { Card, StatsCard, Button, SidebarPlugin, LoaderDots, ErrorMsg };
