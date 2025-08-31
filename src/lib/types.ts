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
