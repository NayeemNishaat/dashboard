import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
const FeaturePage = () => import("@/layout/dashboard/FeaturePage.vue");

//Onboarding
import Loading from "@/pages/Auth/Loading.vue";
const LoginError = () => import("@/pages/Auth/LoginError.vue");

const Onboarding = () => import("@/layout/dashboard/Onboarding.vue");

const DeveloperSettings = () => import("@/pages/Settings/Developer.vue");
const SetupSummary = () => import("@/pages/SetupSummary.vue");

// GeneralViews
const NotFound = () => import("@/pages/NotFoundPage.vue");

import Summary from "@/pages/Summary.vue";

const Billing = () => import("@/pages/Billing/Billing.vue");

const UpgradePlan = () => import("@/pages/Billing/UpgradePlan.vue");

//settings
import SettingsPanel from "@/pages/Settings/Panel.vue";
import GeneralSettings from "@/pages/Settings/General.vue";

//banners
const BannerForm = () => import("@/pages/Banners/BannerForm.vue");
import BannerSettings from "@/pages/Settings/Banner.vue";

const ViewBanners = () => import("@/pages/Banners/ViewBanners.vue");

//products
const ViewProducts = () => import("@/pages/Products/ViewProducts.vue");
import ProductSettings from "@/pages/Settings/Product.vue";

//notifications
const ViewNotifications = () =>
  import("@/pages/Notifications/ViewNotifications.vue");
const NotificationSettings = () => import("@/pages/Settings/Notification.vue");

const CategorySettings = () => import("@/pages/Settings/Category.vue");

// authentication
import Login from "@/pages/Auth/Login.vue";
import Callback from "@/pages/Auth/Callback.vue";
import ShopifyLogin from "@/pages/Auth/ShopifyLogin.vue";

import {
  ifAuthenticated,
  ifFinishedOnboarding,
  ifNotAuthenticated,
  ifOnboarding,
  ifHasFeatureAccess
} from "./guards";

const createUpgradeRoute = (feature: string) => ({
  path: "upgrade",
  name: `${feature} unavailable`,
  component: UpgradePlan,
  beforeEnter: ifHasFeatureAccess(feature),
  props: { feature }
});

const routes: any = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/welcome",
    name: "onboarding",
    component: Onboarding,
    beforeEnter: ifOnboarding,
  },
  {
    path: "/callback",
    name: "Callback",
    component: Callback
  },
  {
    path: "/shopify-login",
    name: "shopify-login",
    component: ShopifyLogin
  },
  {
    path: "/login-failed",
    name: "login-failed",
    component: LoginError
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/setup",
    children: [
      {
        path: "loading",
        name: "loading",
        component: Loading,
        beforeEnter: ifAuthenticated
      },
      {
        path: "setup",
        name: "setup-summary",
        component: SetupSummary,
        beforeEnter: ifFinishedOnboarding,
        meta: {
          title: "Finish setup process"
        }
      },
      {
        path: "summary",
        name: "summary",
        component: Summary,
        beforeEnter: ifFinishedOnboarding,
        meta: {
          title: "Summary"
        }
      },
      {
        path: "billing",
        name: "billing",
        component: Billing,
        beforeEnter: ifFinishedOnboarding,
        meta: {
          title: "Billing"
        }
      },
      {
        path: "banners",
        name: "banners",
        redirect: "/banners/view",
        component: FeaturePage,
        meta: {
          title: "Banners"
        },
        beforeEnter: ifHasFeatureAccess("banners"),
        children: [
          createUpgradeRoute("banners"),
          {
            path: "view",
            name: "view banners",
            component: ViewBanners,
            beforeEnter: ifHasFeatureAccess("banners"),
            meta: {
              title: "View Banners"
            }
          },
          {
            path: "add",
            name: "add banner",
            component: BannerForm,
            beforeEnter: ifHasFeatureAccess("banners"),
            meta: {
              title: "Add Banner"
            }
          },
          {
            path: "edit/:bannerid",
            name: "edit banner",
            component: BannerForm,
            beforeEnter: ifHasFeatureAccess("banners"),
            meta: {
              title: "Edit Banner"
            }
          }
        ]
      },
      {
        path: "products",
        name: "products",
        redirect: "/products/view",
        component: FeaturePage,
        beforeEnter: ifHasFeatureAccess("products"),
        meta: {
          title: "Products"
        },
        children: [
          createUpgradeRoute("products"),
          {
            path: "view",
            name: "view products",
            component: ViewProducts,
            beforeEnter: ifHasFeatureAccess("products"),
            meta: {
              title: "Products performance"
            }
          }
        ]
      },
      {
        path: "notifications",
        name: "notifications",
        redirect: "/notifications/view",
        component: FeaturePage,
        beforeEnter: ifHasFeatureAccess("notifications"),
        meta: {
          title: "Notifications"
        },
        children: [
          createUpgradeRoute("notifications"),
          {
            path: "view",
            name: "view notifications",
            component: ViewNotifications,
            beforeEnter: ifHasFeatureAccess("notifications"),
            meta: {
              title: "Notifications performance"
            }
          }
        ]
      },
      {
        path: "settings",
        name: "settings",
        redirect: "/settings/general",
        component: SettingsPanel,
        beforeEnter: ifFinishedOnboarding,
        meta: {
          title: "Settings"
        },
        children: [
          {
            path: "banners",
            name: "banners settings",
            component: BannerSettings,
            meta: {
              title: "Banners Settings"
            }
          },
          {
            path: "categories",
            name: "categories settings",
            component: CategorySettings,
            meta: {
              title: "Category Settings"
            }
          },
          {
            path: "developer",
            name: "developer settings",
            component: DeveloperSettings,
            meta: {
              title: "Developer Settings"
            }
          },
          {
            path: "general",
            name: "general settings",
            component: GeneralSettings,
            meta: {
              title: "General Settings"
            }
          },
          {
            path: "products",
            name: "products settings",
            component: ProductSettings,
            meta: {
              title: "Product Settings"
            }
          },
          {
            path: "notifications",
            name: "notifications settings",
            component: NotificationSettings,
            meta: {
              title: "Notification Settings"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      title: "Page not found"
    }
  }
];

export default routes;
