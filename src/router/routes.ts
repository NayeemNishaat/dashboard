import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Summary from "@/pages/Summary.vue";
import Billing from "@/pages/Billing.vue";
import AdCreatives from "@/pages/AdCreatives.vue";
import Campaigns from "@/pages/Campaigns.vue";
import AllSegments from "@/pages/Segments/All.vue";
import SegmentDetail from "@/pages/Segments/Detail.vue";
import Settings from "@/pages/Settings.vue";

//auth pages
import Login from "@/auth/Login.vue";
import LoginFailed from "@/auth/LoginFailed.vue";
import ShopifyLogin from "@/auth/ShopifyLogin.vue";
import Auth0Callback from "@/auth/Callback.vue";
import Authorizing from "@/auth/Authorizing.vue";

import { RouteRecordRaw } from "vue-router";
import { ifAuthenticated, ifNotAuthenticated } from "./guards";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/logging-in",
    name: "logging-in",
    component: Auth0Callback
  },
  {
    path: "/loading",
    name: "authorizing",
    component: Authorizing
  },
  {
    path: "/shopify-login/:name",
    name: "shopify-login",
    component: ShopifyLogin
  },
  {
    path: "/login-failed",
    name: "login-failed",
    component: LoginFailed
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/summary",
    children: [
      {
        path: "summary",
        name: "summary",
        component: Summary,
        beforeEnter: ifAuthenticated
      },
      {
        path: "segments",
        name: "all segments",
        component: AllSegments,
        beforeEnter: ifAuthenticated
      },
      {
        path: "segments/:segment",
        name: "segments detail",
        component: SegmentDetail,
        beforeEnter: ifAuthenticated
      },
      {
        path: "campaigns",
        name: "campaigns",
        component: Campaigns,
        beforeEnter: ifAuthenticated
      },
      {
        path: "creatives",
        name: "creatives",
        component: AdCreatives,
        beforeEnter: ifAuthenticated
      },
      {
        path: "settings",
        name: "settings",
        component: Settings,
        beforeEnter: ifAuthenticated
      },
      {
        path: "billing",
        name: "billing",
        component: Billing,
        beforeEnter: ifAuthenticated
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
