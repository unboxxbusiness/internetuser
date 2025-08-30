import { customers, availablePlans } from '@/lib/data';
import { notFound } from 'next/navigation';
import { CustomerDetailsClient } from './customer-details-client';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customer = customers.find(c => c.id === params.id);

  if (!customer) {
    notFound();
  }

  const plan = availablePlans.find(p => p.id === customer.planId);

  return <CustomerDetailsClient customer={customer} plan={plan} availablePlans={availablePlans} />;
}
