import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { Customer } from "@/lib/types";

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const planPrices: Record<string, number> = {
  Basic: 29.99,
  Premium: 59.99,
  Pro: 99.99,
};


export function RecentSales({ customers }: { customers: Customer[] }) {
  return (
    <div className="space-y-8">
      {customers.map(customer => (
        <div className="flex items-center" key={customer.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {customer.email}
            </p>
          </div>
          <div className="ml-auto font-medium">+${planPrices[customer.plan].toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
