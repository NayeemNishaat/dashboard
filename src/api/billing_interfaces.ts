export interface PlanProducts {
    personalization: {
        banners?: {
            banner_limit: number;
            custom_layout: boolean;
            allowed_layouts: Array<string>;
        };
        products?: {
            recent: boolean;
            related: boolean;
            user_related: boolean;
            user_related_categories: boolean;
            similar: boolean;
            top: boolean;
        };
        ab_testing?: boolean;
        notifications?: boolean;
    }
    segments?: {
        segment_limit: number;
    };
}

interface Trial {
    since: string;
    until: string;
}

export interface ClientBillingDetails {
    available_plans: Array<Plan>;
    subscriptions: { active: PlanSubscription | null; pending: PlanSubscription | null };
    payments_configured: boolean | null;
    trial: Trial | null;
}

export interface Plan {
    plan_id: string;
    active: boolean;
    annual: boolean;
    description: string;
    name: string;
    price: number;
    trial_period_days: number;
    products: PlanProducts;
}

interface PlanSubscription extends Plan {
    subscription_id: string;
    since: string;
    until: string;
    current_period_start: string;
}

export interface ClientSubscriptionAccess {
    name: string;
    access: PlanProducts;
}
