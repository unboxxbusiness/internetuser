export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  speed: number;
  dataLimit: number;
}

export interface Payment {
  id: string;
  customer: string;
  email: string;
  plan: string;
  status: "succeeded" | "failed" | "refunded";
  amount: number;
  date: Date;
}

export interface SupportTicket {
    id: string;
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
