import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Summary from "@/pages/Summary.vue";
import Billing from "@/pages/Billing.vue";
import AdCreatives from "@/pages/AdCreatives.vue";
import Campaigns from "@/pages/Campaigns.vue";
import Segments from "@/pages/Segments.vue";
import Settings from "@/pages/Settings.vue";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/summary",
    children: [
      {
        path: "summary",
        name: "summary",
        component: Summary
      },
      {
        path: "segments",
        name: "segments",
        component: Segments
      },
      {
        path: "campaigns",
        name: "campaigns",
        component: Campaigns
      },
      {
        path: "creatives",
        name: "creatives",
        component: AdCreatives
      },
      {
        path: "settings",
        name: "settings",
        component: Settings
      },
      {
        path: "billing",
        name: "billing",
        component: Billing
      }
    ]
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
