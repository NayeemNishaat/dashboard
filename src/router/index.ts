import { nextTick } from "vue";
// import { app } from "@/main";
import VueRouter from "vue-router";
import routes from "./routes";
// app.use(VueRouter as any);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.afterEach(async (to, from) => {
  await nextTick(); /* (() => { */
  const componentTitle = to && to.meta && to.meta.title;
  document.title = `${componentTitle ? componentTitle + " | " : ""}DataCue`;
  // });
});
export default router;
