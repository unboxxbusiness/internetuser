

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
  date: Date;
}

export interface SupportTicket {
    id: string;
    userId: string;
    subject: string;
    description?: string;
    user: {
        name: string;
        email: string;
    };
    status: 'open' | 'in-progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt?: Date;
    lastUpdated: Date;
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'billing' | 'plan-change' | 'general' | 'warning';
  isRead: boolean;
  createdAt: Date;
}

export interface UserSettings {
    paperlessBilling: boolean;
    paymentReminders: boolean;
}
