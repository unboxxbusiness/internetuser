import type { Customer, Plan, Payment } from './types';

export const availablePlans: Plan[] = [
  {
    id: 'plan-basic',
    planName: 'Basic Fiber',
    bandwidth: '100 Mbps',
    cost: 29.99,
    description: 'Perfect for browsing, streaming, and light use.',
  },
  {
    id: 'plan-standard',
    planName: 'Standard Fiber',
    bandwidth: '500 Mbps',
    cost: 49.99,
    description: 'Great for families, HD streaming, and online gaming.',
  },
  {
    id: 'plan-pro',
    planName: 'Pro Fiber',
    bandwidth: '1 Gbps',
    cost: 79.99,
    description: 'Ultimate speed for heavy users, 4K streaming, and professional needs.',
  },
  {
    id: 'plan-enterprise',
    planName: 'Enterprise Fiber',
    bandwidth: '10 Gbps',
    cost: 299.99,
    description: 'Dedicated fiber for business-critical applications.',
  },
];

const generatePaymentHistory = (joinDate: Date, cost: number): Payment[] => {
  const payments: Payment[] = [];
  const today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  
  for (let i = 0; i < 6; i++) {
    const paymentDate = new Date(year, month, 15);
    if (paymentDate < joinDate) break;

    const statuses: Array<'paid' | 'pending' | 'overdue'> = ['paid', 'paid', 'paid', 'paid', 'pending', 'overdue'];
    let status: 'paid' | 'pending' | 'overdue' = 'paid';
    
    if (i === 0 && Math.random() > 0.5) {
      status = 'pending';
    }
    if (i === 1 && Math.random() > 0.7) {
      status = 'overdue';
    }


    payments.push({
      id: `payment-${Math.random().toString(36).substr(2, 9)}`,
      date: paymentDate.toISOString().split('T')[0],
      amount: cost,
      status: status,
    });
    
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
  }
  return payments.reverse();
};

export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '555-0101',
    address: '123 Maple St, Springfield',
    joinedDate: '2023-01-15',
    planId: 'plan-standard',
    paymentHistory: generatePaymentHistory(new Date('2023-01-15'), 49.99),
    usageHistory: 'Average monthly data usage is 300GB. Peak usage during evenings for streaming.',
    typicalUseCases: 'HD video streaming on two devices, casual online gaming, video conferencing for work.',
  },
  {
    id: 'cust-2',
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    phone: '555-0102',
    address: '456 Oak Ave, Springfield',
    joinedDate: '2022-11-20',
    planId: 'plan-basic',
    paymentHistory: generatePaymentHistory(new Date('2022-11-20'), 29.99),
    usageHistory: 'Monthly data usage around 80GB. Consistent usage throughout the day.',
    typicalUseCases: 'Web browsing, social media, and occasional standard-definition streaming.',
  },
  {
    id: 'cust-3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '555-0103',
    address: '789 Pine Ln, Springfield',
    joinedDate: '2023-05-10',
    planId: 'plan-pro',
    paymentHistory: generatePaymentHistory(new Date('2023-05-10'), 79.99),
    usageHistory: 'High data usage, exceeding 1TB monthly. Large file downloads and uploads are common.',
    typicalUseCases: '4K video streaming, competitive online gaming, live streaming, running a home server.',
  },
  {
    id: 'cust-4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    phone: '555-0104',
    address: '101 Star Blvd, Metropolis',
    joinedDate: '2023-08-01',
    planId: 'plan-standard',
    paymentHistory: generatePaymentHistory(new Date('2023-08-01'), 49.99),
    usageHistory: 'Monthly usage is about 500GB. High bandwidth required for simultaneous activities.',
    typicalUseCases: 'Multiple users streaming, video calls, and smart home devices running constantly.',
  },
];
