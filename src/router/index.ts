import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    const componentTitle = to && to.meta && to.meta.title;
    document.title = `${componentTitle ? componentTitle + " | " : ""}DataCue`;
  });
});
export default router;
