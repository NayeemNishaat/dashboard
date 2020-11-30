import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Overview from "@/pages/Overview.vue";
import Campaigns from "@/pages/Campaigns.vue";
import RecommendationsSummary from "@/pages/Recommendations/Summary.vue";
import RecommendationsDetail from "@/pages/Recommendations/Detail.vue";
import Reports from "@/pages/Reports.vue";
import Billing from "@/pages/Billing.vue";
import Settings from "@/pages/Settings.vue";

//auth pages
import LoginPage from "@/auth/LoginPage.vue";
import LoginFailed from "@/auth/LoginFailed.vue";
import ShopifyLogin from "@/auth/ShopifyLogin.vue";
import Auth0Callback from "@/auth/Callback.vue";
import Authorizing from "@/auth/Authorizing.vue";

import { RouteRecordRaw } from "vue-router";
import { ifAuthenticated, ifLoggedIn, ifNotAuthenticated } from "./guards";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
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
    component: Authorizing,
    beforeEnter: ifLoggedIn
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
    redirect: "/overview",
    children: [
      {
        path: "overview",
        name: "overview",
        component: Overview,
        beforeEnter: ifAuthenticated
      },
      {
        path: "campaigns",
        name: "campaigns",
        component: Campaigns,
        beforeEnter: ifAuthenticated
      },
      {
        path: "recommendations/summary",
        name: "recommendations-summary",
        component: RecommendationsSummary,
        beforeEnter: ifAuthenticated
      },
      {
        path: "recommendations/:segment",
        name: "recommendations-detail",
        component: RecommendationsDetail,
        beforeEnter: ifAuthenticated
      },
      {
        path: "reports",
        name: "reports",
        component: Reports,
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
