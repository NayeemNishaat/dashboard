import { Plan } from "@/api/billing_interfaces";
import { ComposerTranslation } from "vue-i18n";
import plans from "./plans.json";
export interface DisplayPlan extends Plan {
    selected: boolean;
    features: Array<string>;
}

export const fillPlanDetails = (plan: DisplayPlan, t: ComposerTranslation): DisplayPlan => {
    const newPlan = plans.find((p) => p.name === plan.name);
    if (!newPlan) {
        return plan;
    }
    plan.trial_period_days = newPlan.trial_period_days;
    plan.description = newPlan.description;
    plan.features = getFeaturesFromProductDetails(plan, t);
    return plan;
}

const getFeaturesFromProductDetails = (plan: DisplayPlan, t: ComposerTranslation): Array<string> => {
    const planProducts = plan.products.personalization;
    let features: Array<string> = [];
    if (planProducts.banners?.banner_limit) {
        features.push(t("{count} dynamic banners", {
            count: planProducts.banners.banner_limit,
        }))
    }
    if (Array.isArray(planProducts.banners?.allowed_layouts)) {
        features.push(t("{count} banner layouts", {
            count: planProducts.banners?.allowed_layouts.length || 0,
        }, { plural: planProducts.banners?.allowed_layouts.length || 0 }))
    }
    if (Array.isArray(planProducts.banners?.custom_layout)) {
        features.push(t("custom designed banner layouts"))
    }
    if (planProducts.products?.recent) {
        features.push(t("recently viewed products"))
    }
    if (planProducts.products?.related) {
        features.push(t("frequently bought together (cross-sell)"))
    }
    if (planProducts.products?.similar) {
        features.push(t("similar products (up-sell)"))
    }
    if (planProducts.products?.user_related) {
        features.push(t("personalized products for each visitor"))
    }
    if (planProducts.products?.user_related_categories) {
        features.push(t("personalized categories for each visitor"))
    }
    if (planProducts.products?.top) {
        features.push(t("category top products"))
    }
    if (planProducts.notifications) {
        features.push(t("web notifications"))
    }
    if (planProducts.ab_testing) {
        features.push(t("a/b testing (coming soon)"))
    }
    features.push(t("google analytics support"));
    features.push(t("email support"));
    return features;
}