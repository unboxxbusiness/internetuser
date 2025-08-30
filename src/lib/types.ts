export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Plan {
  id: string;
  planName: string;
  bandwidth: string;
  cost: number;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  planId: string | null;
  paymentHistory: Payment[];
  usageHistory: string;
  typicalUseCases: string;
}
