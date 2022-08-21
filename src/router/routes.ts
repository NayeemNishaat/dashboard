import { RouteConfig } from "vue-router";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
const FeaturePage = () =>
  import(
    /* webpackChunkName: "feature_page" */ "@/layout/dashboard/FeaturePage.vue"
  );

//Onboarding
import Loading from "@/pages/Onboarding/Loading.vue";
const LegacyOnboarding = () =>
  import(
    /* webpackChunkName: "legacy_onboarding" */ "@/pages/Onboarding/LegacyOnboarding.vue"
  );
const OnboardingOther = () =>
  import(
    /* webpackChunkName: "onboarding_other" */ "@/pages/Onboarding/OnboardingOther.vue"
  );

const Onboarding = () =>
  import(
    /* webpackChunkName: "onboarding" */ "@/pages/Onboarding/Onboarding.vue"
  );

const LoginError = () =>
  import(/* webpackChunkName: "login_error" */ "@/pages/Auth/LoginError.vue");

const OnboardingSignup = () =>
  import(
    /* webpackChunkName: "onboardingsignup" */ "@/components/onboarding/OnboardingSignup.vue"
  );
const Intro = () =>
  import(
    /* webpackChunkName: "onboarding-intro" */ "@/components/onboarding/Intro.vue"
  );
const Setup = () =>
  import(
    /* webpackChunkName: "onboarding-setup" */ "@/components/onboarding/Setup.vue"
  );
const ActivateBillingPlan = () =>
  import(
    /* webpackChunkName: "onboarding-billing" */ "@/components/onboarding/ActivateBillingPlan.vue"
  );

const DeveloperSettings = () =>
  import(
    /* webpackChunkName: "developer_settings" */ "@/pages/Settings/Developer.vue"
  );
const SetupSummary = () =>
  import(/* webpackChunkName: "setup-summary" */ "@/pages/SetupSummary.vue");

// GeneralViews
const NotFound = () =>
  import(/* webpackChunkName: "not_found" */ "@/pages/NotFoundPage.vue");

import Summary from "@/pages/Summary.vue";

const Billing = () =>
  import(/* webpackChunkName: "billing" */ "@/pages/Billing/Billing.vue");

const UpgradePlan = () =>
  import(
    /* webpackChunkName: "upgrade_plan" */ "@/pages/Billing/UpgradePlan.vue"
  );

//settings
import SettingsPanel from "@/pages/Settings/Panel.vue";
import GeneralSettings from "@/pages/Settings/General.vue";

//banners
const BannerForm = () =>
  import(/* webpackChunkName: "bannerform" */ "@/pages/Banners/BannerForm.vue");
import BannerSettings from "@/pages/Settings/Banner.vue";

const ViewBanners = () =>
  import(
    /* webpackChunkName: "viewbanners" */ "@/pages/Banners/ViewBanners.vue"
  );

//products
const ViewProducts = () =>
  import(
    /* webpackChunkName: "viewproducts" */ "@/pages/Products/ViewProducts.vue"
  );
import ProductSettings from "@/pages/Settings/Product.vue";

//notifications
const ViewNotifications = () =>
  import(
    /* webpackChunkName: "viewnotifications" */ "@/pages/Notifications/ViewNotifications.vue"
  );
const NotificationSettings = () =>
  import(
    /* webpackChunkName: "notificationsettings" */ "@/pages/Settings/Notification.vue"
  );

const CategorySettings = () =>
  import(
    /* webpackChunkName: "categorysettings" */ "@/pages/Settings/Category.vue"
  );

// authentication
import Login from "@/pages/Auth/Login.vue";
import SignUp from "@/pages/Auth/Signup.vue";
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

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/:lang/sign-up",
    name: "sign-up",
    component: SignUp,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/onboarding/:platform",
    name: "onboarding",
    component: Onboarding,
    redirect: "/onboarding/:platform/signup",
    children: [
      {
        path: "signup",
        name: "onboarding-signup",
        component: OnboardingSignup,
        beforeEnter: ifOnboarding,
        meta: {
          step: "signup"
        }
      },
      {
        path: "intro",
        name: "onboarding-intro",
        component: Intro,
        beforeEnter: ifOnboarding,
        meta: {
          step: "intro"
        }
      },
      {
        path: "setup",
        name: "onboarding-setup",
        component: Setup,
        beforeEnter: ifOnboarding,
        meta: {
          step: "setup"
        }
      },
      {
        path: "billing",
        name: "onboarding-billing",
        component: ActivateBillingPlan,
        beforeEnter: ifOnboarding,
        meta: {
          step: "billing"
        }
      }
    ]
  },
  {
    path: "/:lang/onboarding",
    component: LegacyOnboarding,
    redirect: "custom",
    children: [
      {
        path: "custom",
        name: "onboarding-other",
        component: OnboardingOther,
        beforeEnter: ifOnboarding,
        props: route => {
          if (route.query.platform) {
            return { platform: route.query.platform };
          }
          return {};
        }
      }
    ]
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
    path: "*",
    name: "not-found",
    component: NotFound,
    meta: {
      title: "Page not found"
    }
  }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../Webs/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
