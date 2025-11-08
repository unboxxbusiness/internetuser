

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  speed: number;
  dataLimit: number;
}

export interface Payment {
  id: string;
  userId: string;
  customer: string;
  email: string;
  plan: string;
  status: "succeeded" | "failed" | "refunded";
  amount: number;
  date: string;
}

export interface BrandingSettings {
    brandName: string;
    icon: string;
    footerText: string;
}

export interface HeroSettings {
    heading: string;
    subheading: string;
    ctaText: string;
}

export interface Subscription {
    planId: string;
    planName: string;
    status: 'active' | 'inactive' | 'cancelled';
    price: number;
    speed: number;
    dataLimit: number | 'Unlimited';
    nextBillingDate: string;
}

export interface UserSettings {
    paperlessBilling: boolean;
    paymentReminders: boolean;
}

export interface Notification {
  id: string;
  subject: string;
  message: string;
  sentAt: string;
}
