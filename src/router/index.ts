import { nextTick } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import routes from "./routes";

// configure router
const router = createRouter({
  history: createWebHistory(),
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.afterEach(async (to, from) => {
  await nextTick();
  const componentTitle = to && to.meta && to.meta.title;
  document.title = `${componentTitle ? componentTitle + " | " : ""}DataCue`;
});
export default router;
